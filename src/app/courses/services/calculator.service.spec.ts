import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

// This is known as a test suite, it can contain multiple specifications
describe("CalculatorService", () => {
  let calculator: CalculatorService;
  let loggerSpy: any;

  // Before each test is ran, this will be ran.
  // This will ensure us a new instance is created for each test
  beforeEach(() => {
    console.log("Calling before each");
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        // We use Angular dependecy injection to swap the actual implementation of LoggerService with out jasmine spy
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    calculator = TestBed.get(CalculatorService);
  });

  // This is known as a specification
  it("should add two numbers", () => {
    // Although here we are creating an instance of the loggerService
    // We would normally want to just create a mock or fake implementation of this service
    // const logger = new LoggerService();

    // Creating a mock dependency
    // This will create a mock implementation of a logger service with a method called log
    // const logger = jasmine.createSpyObj("LoggerService", ["log"]);
    // We can specify a return value for the log method
    // logger.log.and.returnValue();

    // With the use of spyOn, we can check the number of times the log method has been called
    // spyOn(logger, "log");

    // This is the preparation phase
    // Here we setup the components we want to test
    // Define instance of the service
    // const calculator = new CalculatorService(logger);

    console.log("Add test");

    // This is the execution phase
    // Here we complete the actions of what we want to test
    const result = calculator.add(2, 2);
    // These are out test assertions
    expect(result).toBe(4);

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);

    // Pending will notify jasmine, the test is not ready to run
    // pending();
  });

  // This is known as a specification
  it("should subtract two numbers", () => {
    console.log("Subtract test");
    const result = calculator.subtract(2, 2);
    expect(result).toBe(0, "Unexpected subtraction result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
