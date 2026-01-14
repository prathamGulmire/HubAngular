import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentCls } from '../../../environment';

@Injectable({
    providedIn: 'root'
})
export class ManageStudentCourse {

    backendUrl = `${EnvironmentCls.apiUrl}/ManageStudentCourse`;

    constructor(private http: HttpClient) { }

    assignCourse(payload: any) {
        return this.http.post(this.backendUrl + '/AssignCourse', payload);
    }

    getCourseIdsByStudentId(id: any) {
        return this.http.get(this.backendUrl + '/coursesBySid?sid=' + id);
    }

    unassignCourses(data: any) {
        return this.http.post(this.backendUrl + '/unassign', data);
    }
}