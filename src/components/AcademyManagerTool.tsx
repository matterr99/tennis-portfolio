import React, { useState } from 'react';
import { CheckCircle2, UserPlus } from 'lucide-react';

interface StudentProfile {
  id: number;
  name: string;
  tier: 'High Performance' | 'Adult Intermediate' | 'Private Track';
  rating: string;
  email: string;
  skills: {
    fh: number;
    bh: number;
    srv: number;
    ft: number;
  };
}

interface CourtAssignment {
  id: number;
  title: string;
  surface: string;
  program: string;
  coach: string;
  players: number[];
}

const INITIAL_STUDENTS: Record<number, StudentProfile> = {
  1: { id: 1, name: 'Elena Rostova', tier: 'High Performance', rating: '4.5 UTR', email: 'rostova.parent@mail.com', skills: { fh: 8, bh: 7, srv: 9, ft: 8 } },
  2: { id: 2, name: 'Marcus Vance', tier: 'High Performance', rating: '5.0 UTR', email: 'vance.family@web.net', skills: { fh: 9, bh: 8, srv: 7, ft: 9 } },
  3: { id: 3, name: 'Kenji Tanaka', tier: 'High Performance', rating: '4.0 UTR', email: 'tanaka.office@tech.org', skills: { fh: 7, bh: 7, srv: 6, ft: 8 } },
  4: { id: 4, name: 'Chloe Dubois', tier: 'High Performance', rating: '4.5 UTR', email: 'dubois.chloe@euro.fr', skills: { fh: 8, bh: 9, srv: 7, ft: 7 } },
  5: { id: 5, name: 'Mateo Gomez', tier: 'Private Track', rating: '3.5 NTRP', email: 'gomez.mg@tennis.com', skills: { fh: 6, bh: 5, srv: 6, ft: 6 } },
  6: { id: 6, name: 'Liam Gallagher', tier: 'Adult Intermediate', rating: '3.0 NTRP', email: 'liam.g@rock.co.uk', skills: { fh: 5, bh: 4, srv: 5, ft: 6 } },
  7: { id: 7, name: 'Sofia Rossi', tier: 'Adult Intermediate', rating: '3.5 NTRP', email: 'rossi.sofia@design.it', skills: { fh: 6, bh: 6, srv: 6, ft: 5 } },
  8: { id: 8, name: 'Andrej Novak', tier: 'Adult Intermediate', rating: '3.0 NTRP', email: 'novak.a@academy.cz', skills: { fh: 5, bh: 5, srv: 4, ft: 5 } },
  9: { id: 9, name: 'Zara Haddad', tier: 'Adult Intermediate', rating: '3.5 NTRP', email: 'haddad.zara@global.com', skills: { fh: 7, bh: 6, srv: 5, ft: 6 } },
  10: { id: 10, name: 'Julian Mercer', tier: 'Adult Intermediate', rating: '3.0 NTRP', email: 'mercer.j@finance.net', skills: { fh: 4, bh: 5, srv: 6, ft: 4 } },
  11: { id: 11, name: 'Anya Kuznetsov', tier: 'Adult Intermediate', rating: '3.5 NTRP', email: 'anya.k@sports.ru', skills: { fh: 6, bh: 7, srv: 5, ft: 6 } }
};

const INITIAL_COURTS: Record<number, CourtAssignment> = {
  1: { id: 1, title: 'Court 1', surface: 'Hard Court', program: 'High-Performance Juniors', coach: 'Coach Carlos', players: [1, 2, 3, 4] },
  2: { id: 2, title: 'Court 2', surface: 'Clay Court', program: 'Private Match Strategy', coach: 'Coach Amara', players: [5] },
  3: { id: 3, title: 'Court 3', surface: 'Hard Court', program: 'Adult Intermediate Drills', coach: 'Coach Kenji', players: [6, 7, 8, 9, 10, 11] }
};

export const AcademyManagerTool: React.FC = () => {
  const [subTab, setSubTab] = useState<'operations' | 'roster' | 'intake' | 'evaluations'>('operations');
  const [students, setStudents] = useState<Record<number, StudentProfile>>(INITIAL_STUDENTS);
  const [courts, setCourts] = useState<Record<number, CourtAssignment>>(INITIAL_COURTS);
  const [activeCourtId, setActiveCourtId] = useState<number>(1);
  const [attendanceLogs, setAttendanceLogs] = useState<Record<number, number[]>>({
    1: [1, 2, 3]
  });
  const [syncNotice, setSyncNotice] = useState<string>('');

  // Intake form state
  const [intakeName, setIntakeName] = useState('');
  const [intakeEmail, setIntakeEmail] = useState('');
  const [intakeTier, setIntakeTier] = useState<StudentProfile['tier']>('High Performance');
  const [intakeRating, setIntakeRating] = useState('4.5 UTR');
  const [intakeCourt, setIntakeCourt] = useState<string>('1');

  // Evaluation state
  const [evalStudentId, setEvalStudentId] = useState<number>(1);

  const totalScheduled = (Object.values(courts) as CourtAssignment[]).reduce((acc, c) => acc + c.players.length, 0);
  const totalCheckedIn = (Object.values(attendanceLogs) as number[][]).reduce((acc, arr) => acc + arr.length, 0);

  const toggleStudentCheckIn = (courtId: number, studentId: number) => {
    setSyncNotice('');
    setAttendanceLogs((prev) => {
      const current = prev[courtId] || [];
      const exists = current.includes(studentId);
      const next = exists ? current.filter((id) => id !== studentId) : [...current, studentId];
      return { ...prev, [courtId]: next };
    });
  };

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeName.trim() || !intakeEmail.trim()) return;

    const nextId = Object.keys(students).length + 1;
    const newStudent: StudentProfile = {
      id: nextId,
      name: intakeName.trim(),
      tier: intakeTier,
      rating: intakeRating.trim() || '3.5 NTRP',
      email: intakeEmail.trim(),
      skills: { fh: 7, bh: 6, srv: 6, ft: 7 }
    };

    setStudents((prev) => ({ ...prev, [nextId]: newStudent }));

    if (intakeCourt !== 'none') {
      const cId = Number(intakeCourt);
      setCourts((prev) => ({
        ...prev,
        [cId]: {
          ...prev[cId],
          players: [...prev[cId].players, nextId]
        }
      }));
    }

    setIntakeName('');
    setIntakeEmail('');
    setSubTab('roster');
  };

  const updateSkillScore = (skill: keyof StudentProfile['skills'], val: number) => {
    setStudents((prev) => ({
      ...prev,
      [evalStudentId]: {
        ...prev[evalStudentId],
        skills: {
          ...prev[evalStudentId].skills,
          [skill]: val
        }
      }
    }));
  };

  const currentCourt = courts[activeCourtId];
  const evalStudent = students[evalStudentId] || students[1];

  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
      {/* Top Sub-Navigation & Summary Metrics */}
      <div className="p-5 bg-[#FAFAFA] border-b border-black/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#E8E9EC] rounded-lg">
          {[
            { id: 'operations', label: 'Live Court Operations' },
            { id: 'roster', label: `Student Directory (${Object.keys(students).length})` },
            { id: 'intake', label: 'Registration & Intake' },
            { id: 'evaluations', label: 'Technical Evaluations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as typeof subTab)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === tab.id ? 'bg-white text-[#111315] shadow-xs' : 'text-[#525866] hover:text-[#111315]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Clean Unboxed Telemetry Summary */}
        <div className="text-xs font-mono-tabular text-[#525866] flex items-center gap-2">
          <span>3/4 Courts Active</span>
          <span>·</span>
          <span className="text-[#0051FF] font-semibold">
            {totalCheckedIn}/{totalScheduled} Checked In
          </span>
          <span>·</span>
          <span>3 Head Coaches</span>
        </div>
      </div>

      {/* View 1: Live Court Operations */}
      {subTab === 'operations' && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl text-[#111315]">
                  Master Court Allocation Schedule
                </h3>
                <p className="text-xs text-[#525866]">
                  Select an active court to load its on-court attendance clipboard.
                </p>
              </div>
              <span className="text-xs font-mono-tabular text-[#525866]">
                Session: 16:00 – 17:30
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.values(courts) as CourtAssignment[]).map((c) => {
                const isSelected = activeCourtId === c.id;
                const checkedCount = (attendanceLogs[c.id] || []).length;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveCourtId(c.id);
                      setSyncNotice('');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0051FF]/5 border-[#0051FF]'
                        : 'bg-[#FAFAFA] border-black/10 hover:border-black/25'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono-tabular text-[#525866] mb-1">
                      <span>{c.title} · {c.surface}</span>
                      <span className="text-[#059669] font-semibold">● Active</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#111315]">{c.program}</h4>
                    <div className="mt-3 pt-2 border-t border-black/8 flex justify-between items-center text-xs text-[#525866]">
                      <span>{c.coach}</span>
                      <span className="font-mono-tabular font-semibold text-[#111315]">
                        {checkedCount}/{c.players.length} Checked In
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Court 4 Vacant */}
              <div className="p-4 rounded-xl border border-black/8 bg-[#FAFAFA] opacity-60">
                <div className="flex justify-between items-center text-xs font-mono-tabular text-[#525866] mb-1">
                  <span>Court 4 · Hard Court</span>
                  <span>○ Vacant</span>
                </div>
                <h4 className="text-sm font-semibold text-[#525866]">Open Member Practice</h4>
                <div className="mt-3 pt-2 border-t border-black/8 text-xs text-[#525866]">
                  Available for individual ball-machine or member booking.
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Digital Coach Clipboard */}
          <div className="lg:col-span-5 bg-[#FAFAFA] rounded-xl border border-black/10 p-5 space-y-4">
            <div className="border-b border-black/10 pb-3">
              <div className="text-xs font-mono-tabular text-[#0051FF] font-semibold">
                {currentCourt.title} · {currentCourt.coach}
              </div>
              <h4 className="font-display text-2xl text-[#111315]">
                {currentCourt.program}
              </h4>
            </div>

            <div className="divide-y divide-black/8 max-h-64 overflow-y-auto">
              {currentCourt.players.map((sId) => {
                const st = students[sId];
                if (!st) return null;
                const isChecked = (attendanceLogs[currentCourt.id] || []).includes(sId);
                return (
                  <label
                    key={sId}
                    className="py-2.5 px-2 flex items-center justify-between cursor-pointer hover:bg-black/3 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#111315]">{st.name}</div>
                      <div className="text-[11px] font-mono-tabular text-[#525866]">{st.rating}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStudentCheckIn(currentCourt.id, sId)}
                      className="w-4 h-4 rounded accent-[#0051FF] cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>

            <button
              onClick={() => setSyncNotice(`Attendance synchronized for ${currentCourt.title}`)}
              className="w-full py-2.5 rounded-lg bg-[#0051FF] text-white text-xs font-semibold hover:bg-[#0040CC] transition-colors cursor-pointer"
            >
              Synchronize Court Attendance
            </button>

            {syncNotice && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#059669]">
                <CheckCircle2 className="w-4 h-4" />
                <span>{syncNotice}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Student Directory */}
      {subTab === 'roster' && (
        <div className="p-6">
          <div className="rounded-xl border border-black/10 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F4F0] border-b border-black/10 text-[#525866] font-semibold">
                  <th className="p-3 pl-4">Athlete Name</th>
                  <th className="p-3">Development Track</th>
                  <th className="p-3 text-center">UTR / NTRP Rating</th>
                  <th className="p-3">Contact Email</th>
                  <th className="p-3 pr-4 text-right">Evaluation File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/8">
                {(Object.values(students) as StudentProfile[]).map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAFAFA]">
                    <td className="p-3 pl-4 font-semibold text-[#111315]">{s.name}</td>
                    <td className="p-3 text-[#525866]">{s.tier}</td>
                    <td className="p-3 text-center font-mono-tabular font-semibold text-[#0051FF]">
                      {s.rating}
                    </td>
                    <td className="p-3 font-mono-tabular text-[#525866]">{s.email}</td>
                    <td className="p-3 pr-4 text-right">
                      <button
                        onClick={() => {
                          setEvalStudentId(s.id);
                          setSubTab('evaluations');
                        }}
                        className="text-[#0051FF] font-semibold hover:underline cursor-pointer"
                      >
                        Inspect Metrics →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Registration & Intake */}
      {subTab === 'intake' && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleIntakeSubmit} className="lg:col-span-6 space-y-4 bg-[#FAFAFA] p-5 rounded-xl border border-black/10">
            <div>
              <h3 className="font-display text-2xl text-[#111315]">
                New Athlete Intake Registration
              </h3>
              <p className="text-xs text-[#525866]">
                Enroll an athlete into the master directory and assign their court group.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#525866] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={intakeName}
                  onChange={(e) => setIntakeName(e.target.value)}
                  placeholder="e.g. Gabriel Vasquez"
                  className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-[#111315] outline-none focus:border-[#0051FF]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#525866] block mb-1">Primary Contact Email</label>
                <input
                  type="email"
                  required
                  value={intakeEmail}
                  onChange={(e) => setIntakeEmail(e.target.value)}
                  placeholder="athlete@academy.org"
                  className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-[#111315] outline-none focus:border-[#0051FF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#525866] block mb-1">Program Track</label>
                  <select
                    value={intakeTier}
                    onChange={(e) => setIntakeTier(e.target.value as StudentProfile['tier'])}
                    className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-[#111315] outline-none"
                  >
                    <option value="High Performance">High Performance</option>
                    <option value="Adult Intermediate">Adult Intermediate</option>
                    <option value="Private Track">Private Track</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#525866] block mb-1">UTR / NTRP Rating</label>
                  <input
                    type="text"
                    value={intakeRating}
                    onChange={(e) => setIntakeRating(e.target.value)}
                    placeholder="4.5 UTR"
                    className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-[#111315] font-mono-tabular outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-[#525866] block mb-1">Immediate Court Assignment</label>
                <select
                  value={intakeCourt}
                  onChange={(e) => setIntakeCourt(e.target.value)}
                  className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-[#111315] outline-none"
                >
                  <option value="1">Court 1 — High-Performance Juniors</option>
                  <option value="2">Court 2 — Private Match Strategy</option>
                  <option value="3">Court 3 — Adult Intermediate Drills</option>
                  <option value="none">Directory Only (Unassigned)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#0051FF] text-white text-xs font-semibold hover:bg-[#0040CC] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Complete Athlete Registration
            </button>
          </form>

          <div className="lg:col-span-6 space-y-4">
            <h4 className="font-display text-2xl text-[#111315]">
              Academy Curriculum Framework
            </h4>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/10 space-y-1.5">
                <div className="text-xs font-mono-tabular text-[#0051FF] font-semibold">
                  Junior High-Performance Track · Mon / Tue / Thu 16:00
                </div>
                <div className="text-sm font-semibold text-[#111315]">
                  Biomechanical & Tactical Pattern Simulation
                </div>
                <p className="text-xs text-[#525866] leading-relaxed">
                  High-tempo live-ball drilling emphasizing split-step pre-activation, recovery geometry, and deep neutral rally tolerance.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/10 space-y-1.5">
                <div className="text-xs font-mono-tabular text-[#059669] font-semibold">
                  Adult Development Track · Wed / Fri 16:00
                </div>
                <div className="text-sm font-semibold text-[#111315]">
                  Scaled Compression & Doubles Positioning
                </div>
                <p className="text-xs text-[#525866] leading-relaxed">
                  Progressive compression drills (Green Dot to Standard Yellow) designed to maximize touch volume and eliminate defensive swing deceleration.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 4: Technical Evaluations */}
      {subTab === 'evaluations' && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3 bg-[#FAFAFA] p-5 rounded-xl border border-black/10">
            <label className="text-xs font-semibold text-[#525866] block">
              Select Athlete File
            </label>
            <select
              value={evalStudentId}
              onChange={(e) => setEvalStudentId(Number(e.target.value))}
              className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-xs font-semibold text-[#111315] outline-none"
            >
              {(Object.values(students) as StudentProfile[]).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rating})
                </option>
              ))}
            </select>
            <p className="text-xs text-[#525866] pt-2 leading-relaxed">
              Adjust any slider on the right to update the athlete’s live technical evaluation benchmark.
            </p>
          </div>

          <div className="lg:col-span-8 p-6 rounded-xl bg-[#FAFAFA] border border-black/10 space-y-6">
            <div className="flex justify-between items-start border-b border-black/10 pb-4">
              <div>
                <h3 className="font-display text-3xl text-[#111315]">{evalStudent.name}</h3>
                <div className="text-xs font-mono-tabular text-[#525866] mt-1">
                  {evalStudent.tier} · {evalStudent.rating} · {evalStudent.email}
                </div>
              </div>
              <span className="text-xs font-mono-tabular font-semibold text-[#0051FF]">
                Active Evaluation
              </span>
            </div>

            <div className="space-y-5">
              {[
                { key: 'fh' as const, label: 'Forehand Rally Depth & Spin Control' },
                { key: 'bh' as const, label: 'Backhand Kinetic Stability' },
                { key: 'srv' as const, label: 'First-Serve Placement & Pronation' },
                { key: 'ft' as const, label: 'Split-Step Pre-Activation & Recovery' }
              ].map((metric) => {
                const val = evalStudent.skills[metric.key];
                return (
                  <div key={metric.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#111315]">{metric.label}</span>
                      <span className="font-mono-tabular font-semibold text-[#0051FF]">
                        {val} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={val}
                      onChange={(e) => updateSkillScore(metric.key, Number(e.target.value))}
                      className="w-full accent-[#0051FF] cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
