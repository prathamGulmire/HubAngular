
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentCls } from '../../../environment';


@Injectable({
    providedIn: 'root'
})
export class CourseService {

    backendUrl = `${EnvironmentCls.apiUrl}/Course`;

    constructor(private http: HttpClient) { }

    getCourses(id: any) {
        return this.http.get(this.backendUrl + "/GetCourse/" + id);
    }

    addCourse(data: any) {
        return this.http.post(this.backendUrl + "/AddCourse/", data);
    }

    updateCourse(data: any) {
        return this.http.put(this.backendUrl + "/UpdateCourse", data);
    }

    deleteCourse(id: any) {
        return this.http.delete(this.backendUrl + "/DeleteCourse/" + id)
    }
}