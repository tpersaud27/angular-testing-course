import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";
import { toNumber } from "cypress/types/lodash";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // TestBed creates a angular module that will contain the instance of our service
    TestBed.configureTestingModule({
      // HttpClientTestingModule has a mock implementation of the http service
      // This mock implementation will have all the same actions at the http service
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe({
      next: (courses) => {
        // First we expect to get some data back
        expect(courses).toBeTruthy("No courses returned");
        // Check the number of courses
        expect(courses.length).toBe(12, "Incorrect number of courses");
        // Check if this course instance exists
        const course = courses.find((course) => course.id == 12);
        expect(course.titles.description).toBe("Angular Testing Course");
      },
    });
    // We expect one request to be sent at this endpoint
    const request = httpTestingController.expectOne("/api/courses");
    // We expect the request to be a GET request
    expect(request.request.method).toEqual("GET");

    // Execute the http request
    // We should specify which data should be returned
    // This is some test data
    request.flush({ payload: Object.values(COURSES) });
  });

  it("should return course based on id", () => {
    coursesService.findCourseById(12).subscribe({
      next: (course) => {
        // First we expect to get some data back
        expect(course).toBeTruthy("No courses returned");
        // Check the id of the course returned
        expect(course.id).toBe(12);
      },
    });
    // We expect one request to be sent at this endpoint
    const request = httpTestingController.expectOne("/api/courses/12");
    // We expect the request to be a GET request
    expect(request.request.method).toEqual("GET");
    // We pass some test data to the request to trigger the request
    request.flush(COURSES[12]);
  });

  it("should save course data successfully", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe({
      next: (course) => {
        expect(course.id).toBe(12);
      },
    });
    // This will create a http put request
    const request = httpTestingController.expectOne("/api/courses/12");
    // validate the type of request
    expect(request.request.method).toEqual("PUT");
    // Here we are validating the body of the put request sent to the server
    // Check if the data being passed to the endpoint is the data we specified
    expect(request.request.body.titles.description).toBe(
      changes.titles.description
    );

    // This triggers the mock request
    // The data we passed to the request it the mock data
    // Note the data is the course data with the new changes added
    request.flush({ ...COURSES[12], ...changes });
  });

  it("should give error if save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe({
      next: () => {
        fail("save course operation should have failed");
      },
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      },
    });

    // Now we trigger the http request
    const request = httpTestingController.expectOne("/api/courses/12");
    expect(request.request.method).toEqual("PUT");

    request.flush("Save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  // Testing Http Request with Parameters
  it("should find a list of lessons", () => {
    // Setting up the service call
    coursesService.findLessons(12).subscribe({
      next: (lessons) => {
        // Expectations
        // These are the expectations we expect to have when this request is completed
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      },
    });

    // Mocking the http request
    const request = httpTestingController.expectOne(
      (request) => request.url == "/api/lessons"
    );

    // Expecations for the request
    expect(request.request.method).toEqual("GET");
    // Check if the request params include the correct params
    expect(request.request.params.get("courseId")).toEqual("12");
    expect(request.request.params.get("filter")).toEqual("");
    expect(request.request.params.get("sortOrder")).toEqual("asc");
    expect(request.request.params.get("pageNumber")).toEqual("0");
    expect(request.request.params.get("pageSize")).toEqual("3");

    // Trigger the request
    request.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  // After each test this will be executed
  afterEach(() => {
    // verify there are no more requests
    // We want to make sure no other requests are being triggered
    httpTestingController.verify();
  });
});
