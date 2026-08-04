import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="병원길잡이 API", version="1.0.0")

# CORS 설정 - 환경변수에서 허용 origin 가져오기
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Mock 데이터 =====

patients = [
    {"id": "P001", "name": "이민준", "birthDate": "1985-03-15", "gender": "남", "phone": "010-1234-5678", "registrationNumber": "R2024-0801"},
    {"id": "P002", "name": "김수진", "birthDate": "1972-07-22", "gender": "여", "phone": "010-2345-6789", "registrationNumber": "R2024-0802"},
    {"id": "P003", "name": "박영호", "birthDate": "1968-11-03", "gender": "남", "phone": "010-3456-7890", "registrationNumber": "R2024-0803"},
    {"id": "P004", "name": "정하늘", "birthDate": "1990-01-28", "gender": "여", "phone": "010-4567-8901", "registrationNumber": "R2024-0804"},
    {"id": "P005", "name": "최동현", "birthDate": "1955-09-10", "gender": "남", "phone": "010-5678-9012", "registrationNumber": "R2024-0805"},
    {"id": "P006", "name": "한소율", "birthDate": "1998-05-17", "gender": "여", "phone": "010-6789-0123", "registrationNumber": "R2024-0806"},
    {"id": "P007", "name": "윤재석", "birthDate": "1980-12-05", "gender": "남", "phone": "010-7890-1234", "registrationNumber": "R2024-0807"},
    {"id": "P008", "name": "송미래", "birthDate": "1963-04-20", "gender": "여", "phone": "010-8901-2345", "registrationNumber": "R2024-0808"},
]

examinations_data = {
    "P001": [
        {"id": "E001", "name": "혈액검사 (CBC)", "description": "전혈구 검사로 빈혈, 감염, 혈소판 이상 등을 확인합니다.", "location": "검사실 A", "floor": "2층", "order": 1, "duration": 10, "fasting": True, "preparations": ["8시간 이상 금식"], "precautions": ["검사 당일 아침 물만 소량 허용"]},
        {"id": "E002", "name": "흉부 X-ray", "description": "흉부 방사선 촬영으로 폐와 심장 상태를 확인합니다.", "location": "영상의학과", "floor": "1층", "order": 2, "duration": 15, "fasting": False, "preparations": ["금속 장신구 제거", "상의를 검사복으로 교체"], "precautions": ["임신 가능성이 있는 경우 반드시 사전 고지"]},
        {"id": "E003", "name": "심전도 (ECG)", "description": "심장의 전기적 활동을 기록하여 부정맥 등을 확인합니다.", "location": "심장검사실", "floor": "3층", "order": 3, "duration": 20, "fasting": False, "preparations": ["편안한 복장 착용"], "precautions": ["검사 전 카페인 섭취 자제"]},
    ],
    "P002": [
        {"id": "E004", "name": "복부 초음파", "description": "복부 장기의 상태를 확인합니다.", "location": "초음파실", "floor": "2층", "order": 1, "duration": 30, "fasting": True, "preparations": ["8시간 이상 금식", "검사 1시간 전 물 500ml 섭취"], "precautions": ["가스가 차면 검사가 어려울 수 있음"]},
        {"id": "E005", "name": "위내시경", "description": "식도, 위, 십이지장을 직접 관찰하는 검사입니다.", "location": "내시경실", "floor": "3층", "order": 2, "duration": 20, "fasting": True, "preparations": ["전날 저녁 9시 이후 금식"], "precautions": ["수면내시경 시 보호자 동반 필수"]},
    ],
    "P003": [
        {"id": "E006", "name": "CT (복부)", "description": "복부 컴퓨터 단층촬영으로 장기의 이상을 정밀 확인합니다.", "location": "CT실", "floor": "1층", "order": 1, "duration": 30, "fasting": True, "preparations": ["4시간 이상 금식"], "precautions": ["조영제 주입 시 열감 느낄 수 있음"]},
        {"id": "E007", "name": "혈액검사 (간기능)", "description": "간 효소 수치를 측정하여 간 건강 상태를 확인합니다.", "location": "검사실 A", "floor": "2층", "order": 2, "duration": 10, "fasting": True, "preparations": ["8시간 이상 금식"], "precautions": ["검사 전날 음주 금지"]},
        {"id": "E008", "name": "소변검사", "description": "소변을 분석하여 신장 기능과 당뇨 여부를 확인합니다.", "location": "검사실 B", "floor": "2층", "order": 3, "duration": 5, "fasting": False, "preparations": ["중간뇨 채취"], "precautions": ["생리 중인 경우 검사실에 알려주세요"]},
    ],
    "P004": [
        {"id": "E009", "name": "MRI (무릎)", "description": "자기공명영상으로 무릎 관절 내부를 정밀하게 확인합니다.", "location": "MRI실", "floor": "지하 1층", "order": 1, "duration": 40, "fasting": False, "preparations": ["금속 장신구 모두 제거"], "precautions": ["폐소공포증이 있는 경우 사전 고지"]},
    ],
    "P005": [
        {"id": "E010", "name": "대장내시경", "description": "대장 내부를 직접 관찰하여 폴립이나 이상을 확인합니다.", "location": "내시경실", "floor": "3층", "order": 1, "duration": 30, "fasting": True, "preparations": ["검사 전날 저녁 장정결제 복용"], "precautions": ["수면내시경 시 보호자 동반 필수"]},
        {"id": "E011", "name": "혈액검사 (종합)", "description": "전반적인 건강 상태를 파악하는 종합 혈액검사입니다.", "location": "검사실 A", "floor": "2층", "order": 2, "duration": 10, "fasting": True, "preparations": ["12시간 이상 금식"], "precautions": ["당뇨약 복용 중인 경우 의료진에게 고지"]},
    ],
    "P006": [
        {"id": "E012", "name": "갑상선 초음파", "description": "갑상선의 크기와 결절 유무를 확인합니다.", "location": "초음파실", "floor": "2층", "order": 1, "duration": 20, "fasting": False, "preparations": ["목 부위 장신구 제거"], "precautions": []},
        {"id": "E013", "name": "혈액검사 (갑상선기능)", "description": "갑상선 호르몬 수치를 측정합니다.", "location": "검사실 A", "floor": "2층", "order": 2, "duration": 10, "fasting": False, "preparations": [], "precautions": ["갑상선 약 복용 중인 경우 의료진에게 고지"]},
    ],
    "P007": [
        {"id": "E014", "name": "폐기능검사", "description": "폐활량과 호흡 기능을 측정하는 검사입니다.", "location": "호흡기검사실", "floor": "4층", "order": 1, "duration": 30, "fasting": False, "preparations": ["검사 4시간 전 기관지확장제 사용 중단"], "precautions": ["검사 당일 흡연 금지"]},
        {"id": "E015", "name": "흉부 CT", "description": "흉부 컴퓨터 단층촬영으로 폐 상태를 정밀하게 확인합니다.", "location": "CT실", "floor": "1층", "order": 2, "duration": 20, "fasting": False, "preparations": ["금속 장신구 제거"], "precautions": ["조영제 사용 시 열감 느낄 수 있음"]},
    ],
    "P008": [
        {"id": "E016", "name": "골밀도 검사 (DEXA)", "description": "뼈의 밀도를 측정하여 골다공증 여부를 확인합니다.", "location": "영상의학과", "floor": "1층", "order": 1, "duration": 15, "fasting": False, "preparations": ["편안한 복장 착용"], "precautions": []},
        {"id": "E017", "name": "유방 초음파", "description": "유방 조직의 이상 유무를 확인합니다.", "location": "초음파실", "floor": "2층", "order": 2, "duration": 20, "fasting": False, "preparations": ["상의 탈의 필요"], "precautions": ["생리 후 1주 이내 검사 권장"]},
        {"id": "E018", "name": "혈액검사 (여성호르몬)", "description": "여성호르몬 수치를 측정합니다.", "location": "검사실 A", "floor": "2층", "order": 3, "duration": 10, "fasting": False, "preparations": [], "precautions": ["호르몬제 복용 중인 경우 의료진에게 고지"]},
    ],
}

from datetime import date

today = date.today().isoformat()

appointments = [
    {"id": "APT-001", "patientId": "P001", "date": today, "time": "09:00", "department": "내과", "doctor": "김철수 교수", "guideStatus": "confirmed", "printStatus": "printed"},
    {"id": "APT-002", "patientId": "P002", "date": today, "time": "09:30", "department": "소화기내과", "doctor": "이영희 교수", "guideStatus": "generated", "printStatus": "not_printed"},
    {"id": "APT-003", "patientId": "P003", "date": today, "time": "10:00", "department": "외과", "doctor": "박민수 교수", "guideStatus": "not_generated", "printStatus": "not_printed"},
    {"id": "APT-004", "patientId": "P004", "date": today, "time": "10:30", "department": "정형외과", "doctor": "정아름 교수", "guideStatus": "not_generated", "printStatus": "not_printed"},
    {"id": "APT-005", "patientId": "P005", "date": today, "time": "11:00", "department": "소화기내과", "doctor": "이영희 교수", "guideStatus": "generated", "printStatus": "not_printed"},
    {"id": "APT-006", "patientId": "P006", "date": today, "time": "13:00", "department": "내분비내과", "doctor": "한지원 교수", "guideStatus": "not_generated", "printStatus": "not_printed"},
    {"id": "APT-007", "patientId": "P007", "date": today, "time": "14:00", "department": "호흡기내과", "doctor": "윤상철 교수", "guideStatus": "not_generated", "printStatus": "not_printed"},
    {"id": "APT-008", "patientId": "P008", "date": today, "time": "14:30", "department": "산부인과", "doctor": "송현정 교수", "guideStatus": "confirmed", "printStatus": "printed"},
]


# ===== API 엔드포인트 =====

@app.get("/")
def root():
    return {"message": "병원길잡이 API 서버가 정상 작동 중입니다."}


@app.get("/api/patients")
def get_patients(search: Optional[str] = None):
    result = patients
    if search:
        result = [p for p in patients if search in p["name"] or search in p["birthDate"] or search in p["registrationNumber"]]
    return result


@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: str):
    patient = next((p for p in patients if p["id"] == patient_id), None)
    if not patient:
        return {"error": "환자를 찾을 수 없습니다."}
    return patient


@app.get("/api/appointments")
def get_appointments():
    result = []
    for apt in appointments:
        patient = next((p for p in patients if p["id"] == apt["patientId"]), None)
        exams = examinations_data.get(apt["patientId"], [])
        result.append({**apt, "patient": patient, "examinations": exams})
    return result


@app.get("/api/appointments/{appointment_id}")
def get_appointment(appointment_id: str):
    apt = next((a for a in appointments if a["id"] == appointment_id), None)
    if not apt:
        return {"error": "예약을 찾을 수 없습니다."}
    patient = next((p for p in patients if p["id"] == apt["patientId"]), None)
    exams = examinations_data.get(apt["patientId"], [])
    return {**apt, "patient": patient, "examinations": exams}


class GuideRequest(BaseModel):
    appointmentId: str


@app.post("/api/generate-guide")
def generate_guide(req: GuideRequest):
    """가상 AI 안내문 생성"""
    apt = next((a for a in appointments if a["id"] == req.appointmentId), None)
    if not apt:
        return {"error": "예약을 찾을 수 없습니다."}

    patient = next((p for p in patients if p["id"] == apt["patientId"]), None)
    exams = examinations_data.get(apt["patientId"], [])

    guide = f"안녕하세요, {patient['name']}님.\n"
    guide += f"{apt['date']} {apt['time']}에 {apt['department']} {apt['doctor']}님 진료와 함께 아래 검사가 예정되어 있습니다.\n\n"

    fasting_exams = [e for e in exams if e["fasting"]]
    if fasting_exams:
        guide += "중요: 금식이 필요합니다\n"
        guide += f"해당 검사: {', '.join(e['name'] for e in fasting_exams)}\n\n"

    guide += "검사 순서 안내\n\n"
    for i, exam in enumerate(sorted(exams, key=lambda x: x["order"]), 1):
        guide += f"{i}번째 검사: {exam['name']}\n"
        guide += f"장소: {exam['floor']} {exam['location']}\n"
        guide += f"소요시간: 약 {exam['duration']}분\n"
        guide += f"{exam['description']}\n"
        if exam["preparations"]:
            guide += f"준비사항: {', '.join(exam['preparations'])}\n"

        # 성별에 따른 주의사항 필터링
        precautions = exam["precautions"]
        if exam["name"] == "소변검사" and patient["gender"] == "남":
            precautions = [p for p in precautions if "생리" not in p]
        if precautions:
            guide += f"주의사항: {', '.join(precautions)}\n"
        guide += "\n"

    total_duration = sum(e["duration"] for e in exams)
    guide += f"전체 예상 소요시간: 약 {total_duration}분\n"
    guide += "문의사항이 있으시면 원무과(내선 1번)로 연락해 주세요.\n"

    return {"guide": guide, "appointmentId": req.appointmentId}


# ===== 서버 실행 =====

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
