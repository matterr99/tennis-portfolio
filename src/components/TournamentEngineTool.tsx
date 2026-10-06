import React, { useState } from 'react';
import { Shuffle, Trash2, CheckCircle2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

interface MatchRecord {
  id: string;
  round: number;
  matchIndex: number;
  p1: string;
  p2: string;
  pin: string;
  winner: string | null;
  scoreStringP1: string;
  scoreStringP2: string;
  type: 'bracket' | 'league';
}

interface StandingRow {
  name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
}

const SAMPLE_ROSTER_32 = [
  'Elena Rostova', 'Marcus Vance', 'Kenji Tanaka', 'Chloe Dubois',
  'Mateo Gomez', 'Amara Okafor', 'Liam Gallagher', 'Sofia Rossi',
  'Andrej Novak', 'Zara Haddad', 'Julian Mercer', 'Anya Kuznetsov',
  'Diego Alvarez', 'Freya Lindstrom', 'Tariq Al-Mansoor', 'Yuki Sato',
  'Oliver Brooks', 'Isabelle Laurent', 'Rohan Mehta', 'Camila Silva',
  'Lucas Fischer', 'Nina Patel', 'Christian Ward', 'Carmen Vega',
  'Søren Nielsen', 'Naomi Johnson', 'Adrian Dumitru', 'Fiona Gallagher',
  'Malik Jackson', 'Elif Yilmaz', 'Sebastian Cross', 'Maya Lin'
];

const generatePIN = () => Math.random().toString(36).substring(2, 6).toUpperCase();

export const TournamentEngineTool: React.FC = () => {
  const [players, setPlayers] = useState<string[]>(SAMPLE_ROSTER_32.slice(0, 8));
  const [rawInput, setRawInput] = useState<string>('');
  const [formatMode, setFormatMode] = useState<'bracket' | 'league-winloss' | 'league-points'>('bracket');
  const [gamesToWin, setGamesToWin] = useState<number>(6);
  const [thirdSetType, setThirdSetType] = useState<'match-tb' | 'full-set'>('match-tb');

  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [matches, setMatches] = useState<Record<string, MatchRecord>>({});
  const [bracketRounds, setBracketRounds] = useState<string[][]>([]);
  const [standings, setStandings] = useState<Record<string, StandingRow>>({});
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');

  // Score input state
  const [p1s1, setP1s1] = useState<number>(6);
  const [p1s2, setP1s2] = useState<number>(6);
  const [p1s3, setP1s3] = useState<number>(0);
  const [p2s1, setP2s1] = useState<number>(4);
  const [p2s2, setP2s2] = useState<number>(3);
  const [p2s3, setP2s3] = useState<number>(0);
  const [pinInput, setPinInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAddPlayers = () => {
    if (!rawInput.trim()) return;
    const parsed = rawInput
      .split(/[\n,]+/)
      .map((s) => s.replace(/^[\d.\-\)\s]+/, '').trim())
      .filter(Boolean);
    if (parsed.length > 0) {
      setPlayers((prev) => [...prev, ...parsed]);
      setRawInput('');
    }
  };

  const launchTournament = () => {
    if (players.length < 2) {
      setFeedback({ type: 'error', text: 'Register at least 2 competitors to launch draw.' });
      return;
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const newMatches: Record<string, MatchRecord> = {};

    if (formatMode === 'bracket') {
      let powerOfTwo = 2;
      while (powerOfTwo < shuffled.length) powerOfTwo *= 2;
      const padded = [...shuffled];
      while (padded.length < powerOfTwo) padded.push('BYE');

      const roundsList: string[][] = [];
      const r1Ids: string[] = [];

      for (let i = 0; i < padded.length; i += 2) {
        const mId = `B-1-${i / 2}`;
        const isBye = padded[i + 1] === 'BYE';
        const pin = generatePIN();
        newMatches[mId] = {
          id: mId,
          round: 1,
          matchIndex: i / 2,
          p1: padded[i],
          p2: padded[i + 1],
          pin,
          winner: isBye ? padded[i] : null,
          scoreStringP1: isBye ? String(gamesToWin) : '-',
          scoreStringP2: isBye ? '0' : '-',
          type: 'bracket'
        };
        r1Ids.push(mId);
      }
      roundsList.push(r1Ids);

      let currentRoundSize = powerOfTwo / 4;
      let roundNum = 2;
      while (currentRoundSize >= 1) {
        const rIds: string[] = [];
        for (let i = 0; i < currentRoundSize; i++) {
          const mId = `B-${roundNum}-${i}`;
          newMatches[mId] = {
            id: mId,
            round: roundNum,
            matchIndex: i,
            p1: 'TBD',
            p2: 'TBD',
            pin: generatePIN(),
            winner: null,
            scoreStringP1: '-',
            scoreStringP2: '-',
            type: 'bracket'
          };
          rIds.push(mId);
        }
        roundsList.push(rIds);
        roundNum++;
        currentRoundSize /= 2;
      }

      // Propagate automatic BYEs from Round 1
      r1Ids.forEach((id) => {
        const m = newMatches[id];
        if (m.winner) {
          const nextId = `B-2-${Math.floor(m.matchIndex / 2)}`;
          if (newMatches[nextId]) {
            if (m.matchIndex % 2 === 0) newMatches[nextId].p1 = m.winner;
            else newMatches[nextId].p2 = m.winner;
          }
        }
      });

      setBracketRounds(roundsList);
      setMatches(newMatches);
      const firstPlayable = Object.values(newMatches).find(
        (m) => m.p1 !== 'TBD' && m.p2 !== 'TBD' && m.p2 !== 'BYE' && !m.winner
      );
      if (firstPlayable) {
        setSelectedMatchId(firstPlayable.id);
        setPinInput(firstPlayable.pin);
      }
    } else {
      // Round Robin Circle Algorithm
      const pool = [...shuffled];
      if (pool.length % 2 !== 0) pool.push('BYE');
      const n = pool.length;

      const initStandings: Record<string, StandingRow> = {};
      pool.forEach((p) => {
        if (p !== 'BYE') {
          initStandings[p] = { name: p, played: 0, won: 0, lost: 0, points: 0 };
        }
      });

      let mCounter = 1;
      for (let round = 0; round < n - 1; round++) {
        for (let i = 0; i < n / 2; i++) {
          const p1 = pool[i];
          const p2 = pool[n - 1 - i];
          if (p1 !== 'BYE' && p2 !== 'BYE') {
            const mId = `L-${mCounter}`;
            newMatches[mId] = {
              id: mId,
              round: round + 1,
              matchIndex: mCounter,
              p1,
              p2,
              pin: generatePIN(),
              winner: null,
              scoreStringP1: '-',
              scoreStringP2: '-',
              type: 'league'
            };
            mCounter++;
          }
        }
        pool.splice(1, 0, pool.pop()!);
      }

      setStandings(initStandings);
      setMatches(newMatches);
      const firstId = Object.keys(newMatches)[0];
      if (firstId) {
        setSelectedMatchId(firstId);
        setPinInput(newMatches[firstId].pin);
      }
    }

    setFeedback(null);
    setIsLaunched(true);
  };

  const handleSelectMatch = (id: string) => {
    const m = matches[id];
    if (!m || m.winner || m.p1 === 'TBD' || m.p2 === 'TBD' || m.p2 === 'BYE') return;
    setSelectedMatchId(id);
    setPinInput(m.pin); // Auto-fill PIN for frictionless verification while still editable
    setFeedback(null);
  };

  const handleVerifyAndSubmit = () => {
    if (!selectedMatchId || !matches[selectedMatchId]) return;
    const m = matches[selectedMatchId];

    if (pinInput.trim().toUpperCase() !== m.pin) {
      setFeedback({ type: 'error', text: `Invalid Match PIN. Expected ${m.pin}.` });
      return;
    }

    let p1Sets = 0;
    let p2Sets = 0;

    if (p1s1 === p2s1 || p1s2 === p2s2) {
      setFeedback({ type: 'error', text: 'Set 1 and Set 2 must have distinct game winners.' });
      return;
    }

    if (p1s1 > p2s1) p1Sets++;
    else p2Sets++;

    if (p1s2 > p2s2) p1Sets++;
    else p2Sets++;

    if (p1Sets === 1 && p2Sets === 1) {
      if (p1s3 === p2s3) {
        setFeedback({ type: 'error', text: 'Split sets (1–1) require a deciding 3rd Set / Match Tiebreak score.' });
        return;
      }
      if (p1s3 > p2s3) p1Sets++;
      else p2Sets++;
    } else if (p1s3 > 0 || p2s3 > 0) {
      setFeedback({ type: 'error', text: 'Straight-set wins (2–0) cannot include a 3rd set score.' });
      return;
    }

    const winner = p1Sets > p2Sets ? m.p1 : m.p2;
    const loser = p1Sets > p2Sets ? m.p2 : m.p1;
    const hasS3 = p1Sets + p2Sets === 3;

    const s1Str = `${p1s1}  ${p1s2}${hasS3 ? `  [${p1s3}]` : ''}`;
    const s2Str = `${p2s1}  ${p2s2}${hasS3 ? `  [${p2s3}]` : ''}`;

    const updatedMatches = { ...matches };
    updatedMatches[selectedMatchId] = {
      ...m,
      winner,
      scoreStringP1: s1Str,
      scoreStringP2: s2Str
    };

    if (m.type === 'bracket') {
      const nextId = `B-${m.round + 1}-${Math.floor(m.matchIndex / 2)}`;
      if (updatedMatches[nextId]) {
        const nextMatch = { ...updatedMatches[nextId] };
        if (m.matchIndex % 2 === 0) nextMatch.p1 = winner;
        else nextMatch.p2 = winner;
        updatedMatches[nextId] = nextMatch;
      }
    } else {
      const nextStandings = { ...standings };
      const winRow = { ...nextStandings[winner] };
      const loseRow = { ...nextStandings[loser] };

      winRow.played += 1;
      winRow.won += 1;
      loseRow.played += 1;
      loseRow.lost += 1;

      if (formatMode === 'league-points') {
        if (!hasS3) {
          winRow.points += 3;
        } else {
          winRow.points += 2;
          loseRow.points += 1;
        }
      }

      nextStandings[winner] = winRow;
      nextStandings[loser] = loseRow;
      setStandings(nextStandings);
    }

    setMatches(updatedMatches);
    setFeedback({ type: 'success', text: `Match #${selectedMatchId} certified: ${winner} advances.` });
  };

  const activeMatch = selectedMatchId ? matches[selectedMatchId] : null;

  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
      {!isLaunched ? (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 5 Cols: Configuration */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h3 className="font-display text-2xl text-[#111315]">
                1. Competitor Intake & Format
              </h3>
              <p className="text-xs text-[#525866] mt-0.5">
                Paste a roster list or load a seeded ATP/WTA academy simulation field.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste names separated by commas or newlines..."
                className="w-full rounded-xl bg-[#F4F4F0] border border-black/10 p-3 text-xs font-mono-tabular text-[#111315] outline-none focus:border-[#0051FF]"
              />
              <button
                onClick={handleAddPlayers}
                className="w-full py-2.5 rounded-lg bg-[#111315] text-white text-xs font-semibold hover:bg-black/85 transition-colors cursor-pointer"
              >
                + Parse & Add Competitors
              </button>
            </div>

            <div className="pt-4 border-t border-black/10 space-y-3">
              <div className="text-xs font-semibold text-[#111315]">
                2. Tournament Draw Structure
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'bracket', label: 'Single-Elimination Knockout Bracket', desc: 'Power-of-two tree with automatic BYE advancement' },
                  { id: 'league-winloss', label: 'Round Robin League (Win / Loss)', desc: 'Circle-method fixture generator ranked by wins' },
                  { id: 'league-points', label: 'Grand Prix Points League (3-2-1-0 Scale)', desc: '2–0 win = 3 pts · 2–1 win = 2 pts · 1–2 loss = 1 pt' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFormatMode(opt.id as typeof formatMode)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      formatMode === opt.id
                        ? 'bg-[#0051FF]/5 border-[#0051FF]'
                        : 'bg-[#FAFAFA] border-black/10 hover:border-black/25'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#111315]">{opt.label}</div>
                    <div className="text-[11px] text-[#525866] mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-[#525866] block mb-1">
                  Set Target
                </label>
                <select
                  value={gamesToWin}
                  onChange={(e) => setGamesToWin(Number(e.target.value))}
                  className="w-full bg-[#F4F4F0] text-xs font-semibold text-[#111315] p-2.5 rounded-lg outline-none"
                >
                  <option value={6}>Standard (6 Games)</option>
                  <option value={8}>Pro Set (8 Games)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#525866] block mb-1">
                  Decider Format
                </label>
                <select
                  value={thirdSetType}
                  onChange={(e) => setThirdSetType(e.target.value as typeof thirdSetType)}
                  className="w-full bg-[#F4F4F0] text-xs font-semibold text-[#111315] p-2.5 rounded-lg outline-none"
                >
                  <option value="match-tb">10-Pt Match TB</option>
                  <option value="full-set">Full 3rd Set</option>
                </select>
              </div>
            </div>

            <button
              onClick={launchTournament}
              className="w-full py-3 rounded-xl bg-[#0051FF] text-white text-xs font-semibold hover:bg-[#0040CC] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle Seeds & Launch Draw ({players.length} Players)
            </button>
          </div>

          {/* Right 7 Cols: Registered Competitors Directory */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#FAFAFA] rounded-xl border border-black/10 p-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-black/10">
                <div>
                  <span className="text-xs font-semibold text-[#111315]">
                    Registered Competitor Field
                  </span>
                  <span className="ml-2 text-xs font-mono-tabular text-[#0051FF] font-semibold">
                    ({players.length} Active)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => setPlayers(SAMPLE_ROSTER_32.slice(0, 8))}
                    className="font-semibold text-[#0051FF] hover:underline cursor-pointer"
                  >
                    Load 8-Player Draw
                  </button>
                  <span className="text-black/20">·</span>
                  <button
                    onClick={() => setPlayers(SAMPLE_ROSTER_32.slice(0, 16))}
                    className="font-semibold text-[#0051FF] hover:underline cursor-pointer"
                  >
                    Load 16-Player Draw
                  </button>
                  <span className="text-black/20">·</span>
                  <button
                    onClick={() => setPlayers([...SAMPLE_ROSTER_32])}
                    className="font-semibold text-[#0051FF] hover:underline cursor-pointer"
                  >
                    Load 32-Player Draw
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {players.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-black/8 text-xs"
                  >
                    <span className="font-medium text-[#111315] truncate">
                      <span className="font-mono-tabular text-[#525866] mr-2">#{idx + 1}</span>
                      {p}
                    </span>
                    <button
                      onClick={() => setPlayers((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-[#525866] hover:text-[#E11D48] p-1 cursor-pointer"
                      title="Remove Player"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-black/10 flex justify-between items-center text-xs">
              <span className="text-[#525866]">
                Non-power-of-two fields automatically receive first-round BYE seeds.
              </span>
              <button
                onClick={() => setPlayers([])}
                className="font-semibold text-[#E11D48] hover:underline cursor-pointer whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Active Workspace Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/10">
            <button
              onClick={() => setIsLaunched(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111315] hover:text-[#0051FF] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Configure Roster & Draw Settings
            </button>
            <div className="text-xs font-mono-tabular text-[#525866]">
              <span>Format: {formatMode === 'bracket' ? 'Knockout Tree' : 'Round Robin League'}</span>
              <span className="mx-2">·</span>
              <span>Sets to {gamesToWin} Games</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Bracket Tree or Standings Table */}
            <div className="lg:col-span-8 space-y-6">
              {formatMode === 'bracket' ? (
                <div className="overflow-x-auto pb-4">
                  <div className="flex items-start gap-6 min-w-max">
                    {bracketRounds.map((roundIds, rIdx) => (
                      <div key={rIdx} className="w-60 space-y-4">
                        <div className="text-xs font-semibold text-[#525866] border-b border-black/10 pb-2">
                          {rIdx === bracketRounds.length - 1
                            ? 'Championship Final'
                            : rIdx === bracketRounds.length - 2
                            ? 'Semifinals'
                            : `Round ${rIdx + 1}`}
                        </div>
                        <div className="space-y-4">
                          {roundIds.map((mId) => {
                            const m = matches[mId];
                            if (!m) return null;
                            const isSelected = selectedMatchId === mId;
                            const isPlayable = m.p1 !== 'TBD' && m.p2 !== 'TBD' && m.p2 !== 'BYE' && !m.winner;

                            return (
                              <div
                                key={mId}
                                onClick={() => handleSelectMatch(mId)}
                                className={`p-3.5 rounded-xl border transition-all ${
                                  isSelected
                                    ? 'bg-[#0051FF]/5 border-[#0051FF] shadow-xs'
                                    : m.winner
                                    ? 'bg-[#FAFAFA] border-black/10 opacity-75'
                                    : isPlayable
                                    ? 'bg-white border-black/15 hover:border-[#0051FF] cursor-pointer'
                                    : 'bg-[#FAFAFA] border-black/8 opacity-50'
                                }`}
                              >
                                <div className="flex justify-between items-center text-xs mb-1.5">
                                  <span className={`font-semibold truncate ${m.winner === m.p1 ? 'text-[#0051FF]' : 'text-[#111315]'}`}>
                                    {m.p1}
                                  </span>
                                  <span className="font-mono-tabular text-[#525866]">{m.scoreStringP1}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-black/8">
                                  <span className={`font-semibold truncate ${m.winner === m.p2 ? 'text-[#0051FF]' : 'text-[#111315]'}`}>
                                    {m.p2}
                                  </span>
                                  <span className="font-mono-tabular text-[#525866]">{m.scoreStringP2}</span>
                                </div>
                                <div className="mt-2 pt-1.5 border-t border-black/5 flex justify-between items-center text-[10px] font-mono-tabular text-[#525866]">
                                  <span>#{m.id}</span>
                                  <span>{m.p2 === 'BYE' ? 'AUTO BYE' : m.winner ? `WON: ${m.winner.split(' ')[0]}` : `PIN: ${m.pin}`}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Live Standings Table */}
                  <div className="rounded-xl border border-black/10 overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F4F4F0] border-b border-black/10 text-[#525866] font-semibold">
                          <th className="p-3 pl-4">Competitor</th>
                          <th className="p-3 text-center">Played</th>
                          <th className="p-3 text-center">Won</th>
                          <th className="p-3 text-center">Lost</th>
                          {formatMode === 'league-points' && (
                            <th className="p-3 pr-4 text-right text-[#0051FF]">Points</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/8 font-mono-tabular">
                        {(Object.values(standings) as StandingRow[])
                          .sort((a, b) => (formatMode === 'league-points' ? b.points - a.points || b.won - a.won : b.won - a.won))
                          .map((row, idx) => (
                            <tr key={row.name} className="hover:bg-[#FAFAFA]">
                              <td className="p-3 pl-4 font-sans-ui font-semibold text-[#111315]">
                                <span className="font-mono-tabular text-[#525866] mr-2">{idx + 1}.</span>
                                {row.name}
                              </td>
                              <td className="p-3 text-center text-[#525866]">{row.played}</td>
                              <td className="p-3 text-center font-semibold text-[#059669]">{row.won}</td>
                              <td className="p-3 text-center text-[#E11D48]">{row.lost}</td>
                              {formatMode === 'league-points' && (
                                <td className="p-3 pr-4 text-right font-semibold text-[#0051FF]">{row.points}</td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Round Robin Fixtures Grid */}
                  <div>
                    <div className="text-xs font-semibold text-[#525866] mb-3">
                      Scheduled Group Fixtures (Click any fixture to load PIN & submit score)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                      {(Object.values(matches) as MatchRecord[]).map((m) => {
                        const isSelected = selectedMatchId === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleSelectMatch(m.id)}
                            className={`p-3 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-[#0051FF]/5 border-[#0051FF]'
                                : m.winner
                                ? 'bg-[#FAFAFA] border-black/8 opacity-70'
                                : 'bg-white border-black/12 hover:border-[#0051FF] cursor-pointer'
                            }`}
                          >
                            <div className="flex justify-between text-xs font-semibold text-[#111315]">
                              <span>{m.p1}</span>
                              <span className="font-mono-tabular">{m.scoreStringP1}</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-[#525866] mt-1 pt-1 border-t border-black/8">
                              <span>{m.p2}</span>
                              <span className="font-mono-tabular">{m.scoreStringP2}</span>
                            </div>
                            <div className="mt-2 flex justify-between text-[10px] font-mono-tabular text-[#525866]">
                              <span>Fixture #{m.id} · Round {m.round}</span>
                              <span className="text-[#0051FF] font-semibold">PIN: {m.pin}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Decentralized PIN Score Verification Sidebar */}
            <div className="lg:col-span-4 bg-[#FAFAFA] rounded-xl border border-black/10 p-5 space-y-4 sticky top-24">
              <div>
                <span className="text-[11px] font-mono-tabular text-[#0051FF] font-semibold">
                  Decentralized Score Entry
                </span>
                <h4 className="font-display text-2xl text-[#111315]">
                  Match Verification Desk
                </h4>
              </div>

              {activeMatch && !activeMatch.winner ? (
                <div className="space-y-4 pt-2 border-t border-black/10">
                  <div className="p-3 rounded-lg bg-white border border-black/10 text-xs">
                    <div className="text-[#525866] font-mono-tabular mb-0.5">
                      Match #{activeMatch.id}
                    </div>
                    <div className="font-semibold text-[#111315]">
                      {activeMatch.p1} vs {activeMatch.p2}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 items-center text-center text-xs font-mono-tabular">
                    <div />
                    <div className="text-[10px] text-[#525866] font-semibold">SET 1</div>
                    <div className="text-[10px] text-[#525866] font-semibold">SET 2</div>
                    <div className="text-[10px] text-[#0051FF] font-semibold">
                      {thirdSetType === 'match-tb' ? 'MATCH TB' : 'SET 3'}
                    </div>

                    <div className="text-left font-sans-ui font-semibold text-[#111315] truncate">
                      {activeMatch.p1.split(' ')[0]}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={p1s1}
                      onChange={(e) => setP1s1(Number(e.target.value))}
                      className="bg-white border border-black/15 rounded-lg p-1.5 text-center font-semibold"
                    />
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={p1s2}
                      onChange={(e) => setP1s2(Number(e.target.value))}
                      className="bg-white border border-black/15 rounded-lg p-1.5 text-center font-semibold"
                    />
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={p1s3}
                      onChange={(e) => setP1s3(Number(e.target.value))}
                      className="bg-white border border-black/15 rounded-lg p-1.5 text-center font-semibold"
                    />

                    <div className="text-left font-sans-ui font-semibold text-[#525866] truncate">
                      {activeMatch.p2.split(' ')[0]}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={p2s1}
                      onChange={(e) => setP2s1(Number(e.target.value))}
                      className="bg-white border border-black/15 rounded-lg p-1.5 text-center font-semibold"
                    />
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={p2s2}
                      onChange={(e) => setP2s2(Number(e.target.value))}
                      className="bg-white border border-black/15 rounded-lg p-1.5 text-center font-semibold"
                    />
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={p2s3}
                      onChange={(e) => setP2s3(Number(e.target.value))}
                      className="bg-white border border-black/15 rounded-lg p-1.5 text-center font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#525866] flex items-center justify-between mb-1">
                      <span>4-Digit Match Security PIN</span>
                      <span className="font-mono-tabular text-[#0051FF]">Auto-filled: {activeMatch.pin}</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-[#525866] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-full bg-white border border-black/15 rounded-lg pl-8 pr-3 py-2 text-xs font-mono-tabular uppercase tracking-widest text-[#111315]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyAndSubmit}
                    className="w-full py-2.5 rounded-lg bg-[#0051FF] text-white text-xs font-semibold hover:bg-[#0040CC] transition-colors cursor-pointer"
                  >
                    Certify & Advance Winner
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#525866] py-4">
                  Select an unplayed match card from the draw to enter set scores and verify its security PIN.
                </p>
              )}

              {feedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-[#ECFDF5] text-[#059669] border border-[#059669]/20'
                      : 'bg-[#FFF1F2] text-[#E11D48] border border-[#E11D48]/20'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
