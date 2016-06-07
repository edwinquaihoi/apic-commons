package com.anz.apic.commons;

import org.junit.runner.RunWith;

import de.helwich.junit.JasmineTest;
import de.helwich.junit.JasmineTestRunner;

@RunWith(JasmineTestRunner.class)
@JasmineTest(
    src =  { "lib/Require" },
    test = { "ApiMethodTest", "ApiOperationTest", "ApiTest", "LoggerTest", "UtilTest", "StatusCodeTest"},
    browser = false
)
public class ApicCommonsMainTest {
}
