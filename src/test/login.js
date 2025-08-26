



//A small login test to see if we can set token from the test environment directly

import { test_login } from "./common";

//To potentially be used as a beforeEach on each subsequent test
test("Sets token and lands on home after login",test_login)