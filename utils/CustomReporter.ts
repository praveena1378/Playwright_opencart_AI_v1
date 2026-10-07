/**
* Custom Reporter for Playwright
 * @author Pavan @SDET-QA
 * @website https://pavanonlinetrainings.com
 * @version 1.0.0
 * @description Custom HTML Reporter for Playwright Test Automation Framework
 */

import {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
    TestStep,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface StepData {
    title: string;
    category: string;
    duration: number;
    status: 'passed' | 'failed' | 'skipped';
    screenshot?: string;
    error?: string;
    stackTrace?: string;
    startTime: string;
    consoleLogs?: string[];
    stepIndex?: number;
    videoStartTime?: number;
    videoEndTime?: number;
}

interface TestData {
    id: string;
    title: string;
    fullTitle: string;
    file: string;
    describePath: string[];
    location: string;
    duration: number;
    status: 'passed' | 'failed' | 'skipped' | 'timedOut';
    retry: number;
    screenshots: { name: string; path: string }[];
    steps: StepData[];
    video?: string;
    trace?: string;
    error?: string;
    errorStack?: string;
    tags: string[];
}

interface FileGroup {
    file: string;
    describes: Map<string, TestData[]>;
    stats: { passed: number; failed: number; skipped: number; total: number };
}

interface SuiteStats {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
}

/* ========== DASHBOARD / CHART DATA INTERFACES ========== */

interface StatusCounts {
    passed: number;
    failed: number;
    skipped: number;
    timedOut: number;
    broken: number;   // always 0 today - TestData has no 'broken' status yet
    unknown: number;  // always 0 today - reserved for future/unmapped statuses
}

interface SeverityStatusCounts {
    passed: number;
    failed: number;
    skipped: number;
    broken: number;
}

interface SeverityCounts {
    blocker: SeverityStatusCounts;
    critical: SeverityStatusCounts;
    normal: SeverityStatusCounts;
    minor: SeverityStatusCounts;
    trivial: SeverityStatusCounts;
}

interface DurationBucket {
    label: string;
    count: number;
}

interface DurationTrendPoint {
    order: number;
    duration: number; // seconds
    title: string;
}

export default class CustomReporter implements Reporter {
    onBegin(_config: FullConfig, _suite: Suite): void {
        // Intentionally left minimal to keep the reporter compatible with Playwright CLI.
    }

    onTestBegin(_test: TestCase, _result: TestResult): void {
        // Intentionally left minimal to keep the reporter compatible with Playwright CLI.
    }

    onTestEnd(_test: TestCase, _result: TestResult): void {
        // Intentionally left minimal to keep the reporter compatible with Playwright CLI.
    }

    onStdOut(_chunk: string | Buffer, _test?: TestCase): void {
        // Intentionally left minimal to keep the reporter compatible with Playwright CLI.
    }

    onStdErr(_chunk: string | Buffer, _test?: TestCase): void {
        // Intentionally left minimal to keep the reporter compatible with Playwright CLI.
    }

    onEnd(_result: FullResult): void {
        // Intentionally left minimal to keep the reporter compatible with Playwright CLI.
    }
}

