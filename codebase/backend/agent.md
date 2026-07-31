# AGENT SPEC & CONTEXT CONTRACT -- VLearn Grounded Socratic Tutor

## 1. Identity & Core Mission
- Agent Name: VLearn-Socratic-Tutor
- Target Track: Huong A -- VLearn (Khoa hoc AI Thuc Chien - Batch 03)
- Role: AI Tutor goi mo tu duy (Socratic Method) neo truc tiep vao Loi giang cua Giang vien qua Slide & Transcript.
- Core Principle: Grounded 100% -- Khong bao gio bia dat (No Hallucination), luon dan chieu chinh exact-paragraph tu Transcript (04_Buoi2.md).

## 2. System Architecture & Data Flow
1. Spatial Slide Matcher: Map Hotspot (hs1/hs2/hs3) -> Timestamp & Line Range (04_Buoi2.md#L145-L160)
2. Grounded Transcript Retriever: Tool get_transcript_chunk(hotspot_id) -> Rut dung loi giang nguyen van tu Giang vien.
3. Socratic Prompt Engine: Temp = 0.1 | Output: JSON { socratic_question, direct_answer, citation }
4. Frontend Render: Pulse Pin phat sang + Highlight Transcript + Render Dynamic Concept Map.

## 3. HAX Principles & Safety Guardrails
- G1 (Scope): Tu choi cau hoi ngoai pham vi Slide/Transcript khoa hoc.
- G9 (Escape Hatch): Nut mau vang 'Giai thich thang cho toi' xuat hien o luot 3 de chuyen sang Direct Answer Mode.
- G10 (Narrowing): Neu khong tim thay transcript, bao ngoai pham vi.
- G11 (Citation): Luon hien thi nhan trich dan exact-paragraph (04_Buoi2.md#L145).

## 4. Active Tool Definitions
- get_transcript_chunk(hotspot_id: str, slide_id: str = 'slide_04'): Rut doan transcript tuong ung voi Hotspot trên Slide.
- get_misconception_heatmap(slide_id: str = 'slide_04'): Cung cap du lieu thong ke ty le hoc vien ket kien thuc cho Giang vien.

## 5. Evaluation & Golden Set Contract
- Golden Set Dataset: eval/golden_set.json (20 test cases).
- Target Metrics: Grounding Accuracy >= 90%, Citation Correctness >= 95%, Response Latency <= 3.0s.

## 6. Decision Log Summary
1. Chon Spatial Slide Hover: Tang trai nghem visual WOW 100% tai buoi Live Demo.
2. Grounded Socratic Prompting: Dat cau hoi goi mo de tang do hieu ban chat.
3. Them Escape Hatch Mode: Tranh gay nan long cho hoc vien khi gap bai qua kho.
