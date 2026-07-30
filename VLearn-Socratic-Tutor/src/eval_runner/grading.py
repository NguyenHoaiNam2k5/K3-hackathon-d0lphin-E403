from __future__ import annotations

from typing import Any


def normalize_value(value: Any) -> Any:
    if isinstance(value, str):
        return value.strip().lower()
    if isinstance(value, list):
        return sorted(normalize_value(item) for item in value)
    return value


def compare_subset(expected: dict[str, Any], actual: dict[str, Any]) -> tuple[bool, list[str], int, int]:
    failures: list[str] = []
    total = 0
    correct = 0
    for key, expected_value in expected.items():
        total += 1
        actual_value = actual.get(key)
        if key == "missing_fields":
            expected_set = set(expected_value)
            actual_set = set(actual_value or [])
            ok = expected_set.issubset(actual_set)
        elif key == "constraints":
            expected_set = set(normalize_value(expected_value))
            actual_set = set(normalize_value(actual_value or []))
            ok = expected_set.issubset(actual_set)
        else:
            ok = normalize_value(actual_value) == normalize_value(expected_value)
        if ok:
            correct += 1
        else:
            failures.append(f"{key}: expected {expected_value!r}, got {actual_value!r}")
    return len(failures) == 0, failures, correct, total


def best_arg_match(expected_args: dict[str, Any], actual_calls: list[tuple[int, dict[str, Any]]]) -> tuple[int, list[str], int, int] | None:
    best: tuple[int, list[str], int, int] | None = None
    for index, actual_call in actual_calls:
        _, arg_failures, arg_correct, arg_total = compare_subset(expected_args, actual_call.get("args", {}))
        candidate = (index, arg_failures, arg_correct, arg_total)
        if best is None or (arg_correct, -len(arg_failures)) > (best[2], -len(best[1])):
            best = candidate
    return best


def evaluate_phase_b(case: dict[str, Any], tool_calls: list[dict[str, Any]], text: str | None) -> dict[str, Any]:
    expect = case["expect"]
    case_failure_type = case["failure_type"]
    if expect.get("no_tool"):
        passed = not tool_calls
        return {
            "passed": passed,
            "routing_correct": passed,
            "args_correct": passed,
            "actual_tool_calls": tool_calls,
            "actual_text": text,
            "case_failure_type": case_failure_type,
            "observed_mismatch": None if passed else "unexpected_tool_call",
            "failure_type": None if passed else case_failure_type,
            "failures": [] if passed else ["expected no tool call"],
        }

    expected_calls = expect.get("tool_calls", [])
    failures: list[str] = []
    routing_correct = True
    args_correct = True
    observed_mismatch: str | None = None
    unmatched_actual: dict[int, dict[str, Any]] = {index: call for index, call in enumerate(tool_calls)}

    for expected_call in expected_calls:
        same_name = [
            (index, actual_call)
            for index, actual_call in unmatched_actual.items()
            if actual_call["name"] == expected_call["name"]
        ]
        if not same_name:
            routing_correct = False
            args_correct = False
            observed_mismatch = observed_mismatch or "missing_tool_call"
            failures.append(f"missing tool call {expected_call['name']}")
            continue

        match = best_arg_match(expected_call.get("args", {}), same_name)
        if match is None:
            routing_correct = False
            args_correct = False
            observed_mismatch = observed_mismatch or "missing_tool_call"
            failures.append(f"missing tool call {expected_call['name']}")
            continue

        matched_index, arg_failures, arg_correct, arg_total = match
        unmatched_actual.pop(matched_index, None)
        if arg_correct != arg_total:
            args_correct = False
            observed_mismatch = observed_mismatch or "wrong_arg_value"
            failures.extend(arg_failures)

    for actual_call in unmatched_actual.values():
        routing_correct = False
        args_correct = False
        observed_mismatch = observed_mismatch or "extra_tool_call"
        failures.append(f"extra tool call {actual_call['name']}")

    passed = routing_correct and args_correct and not failures
    return {
        "passed": passed,
        "routing_correct": routing_correct,
        "args_correct": args_correct,
        "actual_tool_calls": tool_calls,
        "actual_text": text,
        "case_failure_type": case_failure_type,
        "observed_mismatch": None if passed else observed_mismatch,
        "failure_type": None if passed else case_failure_type,
        "failures": failures,
    }


def summarize(results: list[dict[str, Any]]) -> dict[str, Any]:
    total = len(results)
    measured = [item for item in results if item["result"].get("failure_type") != "provider_error"]
    provider_errors = total - len(measured)
    passed = sum(1 for item in measured if item["result"]["passed"])
    summary: dict[str, Any] = {
        "total_cases": total,
        "measured_cases": len(measured),
        "provider_error_cases": provider_errors,
        "passed_cases": passed,
        "case_accuracy": round(passed / len(measured), 4) if measured else 0.0,
    }

    phase_b = [item for item in measured if item["phase"] == "B"]
    if phase_b:
        routing = sum(1 for item in phase_b if item["result"].get("routing_correct"))
        args = sum(1 for item in phase_b if item["result"].get("args_correct"))
        multi = [item for item in phase_b if item.get("is_multiturn")]
        summary.update({
            "tool_routing_accuracy": round(routing / len(phase_b), 4),
            "argument_accuracy": round(args / len(phase_b), 4),
            "multiturn_accuracy": round(sum(1 for item in multi if item["result"]["passed"]) / len(multi), 4) if multi else None,
        })

    failure_counts: dict[str, int] = {}
    observed_mismatch_counts: dict[str, int] = {}
    for item in measured:
        failure_type = item["result"].get("failure_type")
        if failure_type:
            failure_counts[failure_type] = failure_counts.get(failure_type, 0) + 1
        observed_mismatch = item["result"].get("observed_mismatch")
        if observed_mismatch:
            observed_mismatch_counts[observed_mismatch] = observed_mismatch_counts.get(observed_mismatch, 0) + 1
    summary["failure_counts"] = failure_counts
    summary["observed_mismatch_counts"] = observed_mismatch_counts
    return summary


def print_table(results: list[dict[str, Any]], summary: dict[str, Any]) -> None:
    for item in results:
        status = "PASS" if item["result"]["passed"] else "FAIL"
        failure = item["result"].get("failure_type") or ""
        print(f"{item['id']:<28} {status:<5} {failure}")
    print()
    for key, value in summary.items():
        print(f"{key}: {value}")
