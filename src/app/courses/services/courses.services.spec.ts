import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";

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

    // We should specify which data should be returned
    // This is some test data
    request.flush({ payload: Object.values(COURSES) });
  });
});
