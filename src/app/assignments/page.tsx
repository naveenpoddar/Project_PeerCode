import Link from 'next/link';
import { dummyAssignments } from '@/data/assignments';

export default function AssignmentsPage() {
  return (
    <div className="assignments-root">
      <header className="page-header">
        <h1>Assignments</h1>
        <p>Complete coding challenges and auto-evaluate your score.</p>
      </header>

      <div className="assignments-grid">
        {dummyAssignments.map((assignment) => (
          <Link key={assignment.id} href={`/assignments/${assignment.id}`} className="assignment-card">
            <h2>{assignment.title}</h2>
            <p>{assignment.description.substring(0, 100)}...</p>
            <div className="card-footer">
              <span className="badge">
                {assignment.testCases.length} Test Cases
              </span>
              <span className="badge marks">
                {assignment.testCases.length * assignment.marksPerTestCase} Marks Total
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .assignments-root {
          min-height: 100vh;
          background: #f8f9fb;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding: 3rem 2rem;
          color: #111827;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #6b7280;
          font-size: 1.05rem;
        }

        .assignments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .assignment-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 1.75rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .assignment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(79,70,229,0.1);
          border-color: #4f46e5;
        }

        .assignment-card h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #111827;
        }

        .assignment-card p {
          color: #4b5563;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .card-footer {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge.marks {
          background: #e0e7ff;
          color: #4f46e5;
        }
      `}</style>
    </div>
  );
}
