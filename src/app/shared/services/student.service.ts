import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentCls } from '../../../environment';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    backendUrl = `${EnvironmentCls.apiUrl}/Student`;

    constructor(private http: HttpClient) {

    }

    addStudent(data: any) {
        return this.http.post(this.backendUrl + "/addRecord", data);
    }

    getStudent(id: any) {
        return this.http.get<any[]>(this.backendUrl + "/getStudents/" + id);
    }

    updateStudent(data: any) {
        return this.http.put<any>(this.backendUrl + "/UpdateRecord", data);
    }

    deleteStudent(id: number) {
        return this.http.delete<any>(this.backendUrl + "/deleteRecord/" + id);
    }

    login(data: any) {
        return this.http.post<any>(this.backendUrl + "/login", data); //returns {"message", "studentId"}
    }
}