'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import { dummyAssignments, Assignment } from '@/data/assignments';

interface TestResult {
  passed: boolean;
  actualOutput?: string;
  expectedOutput: string;
  error?: string;
}

export default function AssignmentSolvePage(props: { params: Promise<{ assignmentId: string }> }) {
  const params = use(props.params);
  const assignmentId = params.assignmentId;
  const assignment = dummyAssignments.find(a => a.id === assignmentId);

  const [code, setCode] = useState(assignment?.functionBodyTemplate || '');
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);

  if (!assignment) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'sans-serif' }}>
        <h2>Assignment not found</h2>
        <Link href="/assignments">Back to Assignments</Link>
      </div>
    );
  }

  const handleRunCode = () => {
    setIsRunning(true);
    const newResults: Record<string, TestResult> = {};

    try {
      // Create a function from the user's string
      // Security note: In a real app this should run in a Web-Worker, Sandbox, or Backend.
      // E.g., const wrappedCode = `${code}\n return ${assignment.functionName};`
      const userFunction = new Function(`
        ${code}
        return ${assignment.functionName};
      `)();

      if (typeof userFunction !== 'function') {
        throw new Error(`Function ${assignment.functionName} not found.`);
      }

      assignment.testCases.forEach((tc) => {
        try {
          // Parse inputs directly
          const args = JSON.parse(tc.input);
          
          // Execute user function
          const result = userFunction(...args);
          
          // Stringify result to compare easily (naive deep equal for basic arrays/objects)
          const actualOutputStr = JSON.stringify(result);
          // Standardize expected output (some test cases might have spaces)
          const expectedStandardized = JSON.stringify(JSON.parse(tc.expectedOutput));
          
          const passed = actualOutputStr === expectedStandardized;

          newResults[tc.id] = {
            passed,
            actualOutput: actualOutputStr,
            expectedOutput: expectedStandardized,
          };
        } catch (err: any) {
          newResults[tc.id] = {
            passed: false,
            expectedOutput: tc.expectedOutput,
            error: err.toString(),
          };
        }
      });
    } catch (globalErr: any) {
      assignment.testCases.forEach((tc) => {
        newResults[tc.id] = {
          passed: false,
          expectedOutput: tc.expectedOutput,
          error: globalErr.toString(),
        };
      });
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const totalPossibleMarks = assignment.testCases.length * assignment.marksPerTestCase;
  const marksObtained = assignment.testCases.reduce((total, tc) => {
    return total + (results[tc.id]?.passed ? assignment.marksPerTestCase : 0);
  }, 0);

  const hasRun = Object.keys(results).length > 0;

  return (
    <div className="solve-root">
      {/* Navbar */}
      <nav className="solve-nav">
        <div className="nav-left">
          <Link href="/assignments" className="back-btn">← Back</Link>
          <span className="assignment-title">{assignment.title}</span>
        </div>
        <div className="nav-right">
          {hasRun && (
            <div className="score-badge">
              Score: {marksObtained} / {totalPossibleMarks}
            </div>
          )}
          <button className="run-btn" onClick={handleRunCode} disabled={isRunning}>
            {isRunning ? 'Running...' : '▶ Run Code'}
          </button>
        </div>
      </nav>

      <div className="solve-body">
        {/* Left Side: Problem Statement & Test Cases */}
        <div className="split-left">
          <div className="panel description-panel">
            <h2>Problem Statement</h2>
            <p className="description-text">{assignment.description}</p>
          </div>

          <div className="panel testcase-panel">
            <h2>Test Cases</h2>
            <div className="testcase-list">
              {assignment.testCases.map((tc, index) => {
                const res = results[tc.id];
                return (
                  <div key={tc.id} className={`testcase-card ${res ? (res.passed ? 'passed' : 'failed') : ''}`}>
                    <div className="tc-header">
                      <strong>Test Case {index + 1}</strong>
                      {res && (
                        <span className={`tc-status ${res.passed ? 'status-pass' : 'status-fail'}`}>
                          {res.passed ? 'Passed ✓' : 'Failed ✗'} (+{res.passed ? assignment.marksPerTestCase : 0} marks)
                        </span>
                      )}
                    </div>
                    <div className="tc-body">
                      <div className="tc-row">
                        <span className="tc-label">Input:</span>
                        <code className="tc-val">{tc.input}</code>
                      </div>
                      <div className="tc-row">
                        <span className="tc-label">Expected Output:</span>
                        <code className="tc-val">{tc.expectedOutput}</code>
                      </div>
                      
                      {res && !res.passed && (
                        <div className="tc-row actual-row">
                          <span className="tc-label">Your Output:</span>
                          <code className="tc-val error-val">
                            {res.error ? res.error : res.actualOutput}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Monaco Editor */}
        <div className="split-right">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .solve-root {
          height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #f3f4f6;
          color: #111827;
        }

        .solve-nav {
          height: 56px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          flex-shrink: 0;
        }
        .nav-left { display: flex; align-items: center; gap: 1rem; }
        .back-btn {
          color: #6b7280; text-decoration: none; font-size: 0.875rem;
          font-weight: 500; transition: color 0.15s;
        }
        .back-btn:hover { color: #111827; }
        .assignment-title { font-weight: 600; font-size: 1rem; }
        
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .score-badge {
          background: #e0e7ff; color: #4f46e5;
          padding: 0.35rem 0.85rem; border-radius: 999px;
          font-weight: 600; font-size: 0.875rem;
        }
        .run-btn {
          background: #10b981; color: white;
          border: none; border-radius: 8px;
          padding: 0.45rem 1.1rem; font-weight: 600;
          font-size: 0.875rem; cursor: pointer; transition: background 0.15s;
        }
        .run-btn:hover { background: #059669; }
        .run-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .solve-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .split-left {
          flex: 1;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e5e7eb;
          background: #f8f9fb;
          overflow-y: auto;
        }
        .panel { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .panel h2 { font-size: 1.1rem; margin-bottom: 1rem; color: #111827; }
        .description-text { font-size: 0.95rem; color: #4b5563; line-height: 1.6; }

        .testcase-list { display: flex; flex-direction: column; gap: 1rem; }
        .testcase-card {
          background: white; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 1rem;
        }
        .testcase-card.passed { border-color: #34d399; background: #ecfdf5; }
        .testcase-card.failed { border-color: #f87171; background: #fef2f2; }
        
        .tc-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.85rem; font-size: 0.9rem;
        }
        .tc-status { font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; }
        .status-pass { background: #d1fae5; color: #065f46; }
        .status-fail { background: #fee2e2; color: #991b1b; }

        .tc-body { display: flex; flex-direction: column; gap: 0.5rem; }
        .tc-row { display: flex; flex-direction: column; gap: 0.2rem; }
        .tc-label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .tc-val { font-family: 'SF Mono', monospace; font-size: 0.85rem; color: #111827; background: #f3f4f6; padding: 0.4rem; border-radius: 6px; }
        .actual-row .tc-val { color: #b91c1c; background: #fecaca; }

        .split-right {
          flex: 2;
          min-width: 0;
          background: #1e1e1e;
        }
      `}</style>
    </div>
  );
}
