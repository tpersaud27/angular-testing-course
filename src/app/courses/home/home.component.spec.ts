import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { setupCourses } from "../common/setup-test-data";
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let element: DebugElement;
  let coursesService: any;

  // This is the list of beginner courses
  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    // Creating a jasmine spy to mock the coursesService dependency
    // We need to include the dependency also, in this case its the CoursesService
    // We also need to define a list of methods we will be calling in our test
    // findAllCourses is the only method from the service that is being used
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      // Here we want to mock the CoursesService
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        coursesService = TestBed.inject<CoursesService>(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  // We want to check if the container is being shown only if the condition is met
  it("should display only beginner courses", () => {
    // First we want to get the data
    // This will emit an observable
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    // This will apply the data to the DOM
    fixture.detectChanges();
    // We should only have one tab in the DOM because only beginner classes should be displayed
    const tabs = element.queryAll(By.css(".mdc-tab"));
    // We expect only 1 tab to be in the DOM
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });
  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    // This will apply the data to the DOM
    fixture.detectChanges();
    const tabs = element.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });
  it("should display both tabs", () => {
    // Note: Remember setupCourses is a helper method that returns all courses
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = element.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });
  it("should display advanced courses when tab clicked", () => {
    pending();
  });
});
