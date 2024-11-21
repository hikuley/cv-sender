from pydantic import BaseModel


class CVType(BaseModel):
    id: str
    label: str
    fileName: str
    role: str
    message: str


class EmailRequest(BaseModel):
    to_email: str
    subject: str
    cover_letter: str
    cv_type: CVType
