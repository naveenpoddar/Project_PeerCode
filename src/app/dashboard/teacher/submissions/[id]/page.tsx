'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import { ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function SubmissionReviewPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Dummy submission data
  const submission = {
    studentName: 'Rahul Sharma',
    avatar: 'https://i.pravatar.cc/150?u=rahul',
    assignmentTitle: 'Two Sum',
    submittedAt: '2 hours ago',
    score: '45/45',
    testCasesPassed: 3,
    totalTestCases: 3,
    code: `function twoSum(nums, target) {\n  const map = new Map();\n  for(let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if(map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = '/dashboard/teacher';
    }, 1500);
  };

  return (
    <div className="review-root">
      <nav className="review-nav">
        <Link href="/dashboard/teacher" className="back-link">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <div className="center-title">
          Reviewing <strong>{submission.studentName}</strong>'s Submission
        </div>
        <div className="profile-img">
          <img src="https://i.pravatar.cc/150?u=teacher" alt="Teacher" />
        </div>
      </nav>

      <div className="review-content">
        <div className="code-panel">
          <div className="panel-header">
            <div className="student-info">
              <img src={submission.avatar} alt="Student" className="s-avatar" />
              <div>
                <h2>{submission.assignmentTitle}</h2>
                <span className="s-time">Submitted {submission.submittedAt}</span>
              </div>
            </div>
            <div className="status-badge pass">
              <CheckCircle size={16} /> All Tests Passed ({submission.score})
            </div>
          </div>
          <div className="editor-wrapper">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={submission.code}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 }
              }}
            />
          </div>
        </div>

        <div className="feedback-panel">
          <h2>Provide Feedback</h2>
          <p className="subtitle">Evaluate the submission and leave notes for the student.</p>

          <form onSubmit={handleGradeSubmit} className="feedback-form">
            <div className="form-group">
              <label>Adjust Grade (Optional)</label>
              <input 
                type="number" 
                placeholder="e.g. 45" 
                defaultValue="45"
                onChange={e => setGrade(e.target.value)}
                className="input-box min-w"
              />
              <span className="total-marks">/ 45 Marks</span>
            </div>

            <div className="form-group">
              <label>Teacher Comments</label>
              <textarea 
                placeholder="Great use of HashMaps for perfect O(n) time complexity! Keep it up."
                rows={6}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="input-box text-area"
              />
            </div>

            <div className="form-group inline-row">
              <div className="cb-group">
                <input type="checkbox" id="plag" />
                <label htmlFor="plag">Run plagiarism check</label>
              </div>
              <div className="cb-group">
                <input type="checkbox" id="email" defaultChecked />
                <label htmlFor="email">Email student</label>
              </div>
            </div>

            <button type="submit" className={`submit-btn ${submitted ? 'success' : ''}`} disabled={submitted}>
              {submitted ? <><CheckCircle size={18} /> Grade Published</> : <><Send size={18}/> Publish Evaluation</>}
            </button>
          </form>

          {!submitted && (
            <div className="ai-assist-box">
              <AlertCircle size={20} className="ai-icon" />
              <div>
                <h4>AI Assistant Analysis</h4>
                <p>The code uses an optimal O(n) approach. Memory complexity is O(n). Code is clean and readable.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .review-root {
          min-height: 100vh;
          background: #f8f9fb;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex; flex-direction: column;
        }

        /* Nav */
        .review-nav {
          height: 60px; background: white; border-bottom: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.5rem; flex-shrink: 0;
        }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: #6b7280; text-decoration: none; font-weight: 500; font-size: 0.9rem; transition: color 0.2s; }
        .back-link:hover { color: #111827; }
        .center-title { font-size: 1rem; color: #374151; }
        
        .profile-img { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid white; box-shadow: 0 0 0 2px #e5e7eb; }
        .profile-img img { width: 100%; height: 100%; object-fit: cover; }

        /* Content Split */
        .review-content {
          flex: 1; display: flex; overflow: hidden;
        }

        .code-panel {
          flex: 2; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; background: #1e1e1e;
        }
        .panel-header {
          background: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;
        }
        .student-info { display: flex; align-items: center; gap: 1rem; }
        .s-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb; }
        .student-info h2 { font-size: 1.15rem; font-weight: 700; color: #111827; margin-bottom: 0.2rem; }
        .s-time { font-size: 0.8rem; color: #6b7280; }
        
        .status-badge { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.85rem; border-radius: 99px; font-size: 0.85rem; font-weight: 600; }
        .status-badge.pass { background: #d1fae5; color: #065f46; }

        .editor-wrapper { flex: 1; min-height: 0; }

        /* Form side */
        .feedback-panel {
          flex: 1; max-width: 480px; padding: 2rem; background: white; overflow-y: auto;
        }
        .feedback-panel h2 { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
        .subtitle { font-size: 0.95rem; color: #6b7280; margin-bottom: 2rem; line-height: 1.5; }

        .feedback-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 600; color: #374151; }
        .input-box { border: 1px solid #d1d5db; border-radius: 8px; padding: 0.6rem 0.85rem; font-size: 0.95rem; font-family: inherit; transition: border-color 0.2s; outline: none; }
        .input-box:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
        .input-box.min-w { width: 80px; display: inline-block; margin-right: 0.5rem; }
        .total-marks { font-size: 0.9rem; color: #6b7280; font-weight: 500; }
        .text-area { resize: vertical; }

        .inline-row { flex-direction: row; gap: 1.5rem; }
        .cb-group { display: flex; align-items: center; gap: 0.4rem; }
        .cb-group input { width: 16px; height: 16px; accent-color: #8b5cf6; cursor: pointer; }
        .cb-group label { font-size: 0.9rem; font-weight: 500; color: #4b5563; cursor: pointer; }

        .submit-btn {
          margin-top: 1rem; background: #8b5cf6; color: white; border: none; padding: 0.8rem; border-radius: 8px;
          font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: all 0.2s;
        }
        .submit-btn:hover { background: #7c3aed; }
        .submit-btn.success { background: #10b981; cursor: default; }

        .ai-assist-box {
          margin-top: 2.5rem; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px;
          padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start;
        }
        .ai-icon { color: #8b5cf6; flex-shrink: 0; }
        .ai-assist-box h4 { color: #5b21b6; font-size: 0.95rem; margin-bottom: 0.3rem; }
        .ai-assist-box p { color: #6d28d9; font-size: 0.85rem; line-height: 1.5; }
        
        @media (max-width: 768px) {
          .review-content { flex-direction: column; }
          .code-panel { height: 50vh; border-right: none; border-bottom: 1px solid #e5e7eb; }
          .feedback-panel { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
