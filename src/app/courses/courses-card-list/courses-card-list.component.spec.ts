import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";
import { CoursesModule } from "../courses.module";
import { CoursesCardListComponent } from "./courses-card-list.component";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let element: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // We need to declare the component we are testing and any other components that component uses
      // Instead of writing out all the declarations we can just import the module containing the imports
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
      });
  }));

  // Asserting the component is created correctly
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });
  // Assert the component is display a list of courses
  it("should display the course list", () => {
    // Pass some data to the component
    component.courses = setupCourses();

    // Trigger the component change detection
    // This will notify the component some changes were made so the DOM is updated
    fixture.detectChanges();

    // Query the dom for a css class name for the mat card element
    const cards = element.queryAll(By.css(".course-card"));
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });
  // Asserting the content of the list is correct by checking the first course
  it("should display the first course", () => {
    pending();
  });
});
