import React, { useState } from 'react';
import { Language } from '../data/articlesData';
import { ArrowLeft, RotateCcw, Download, BarChart2, X, Check } from 'lucide-react';

interface SimpleScoreData {
  t1: { points: number; games: number; sets: number };
  t2: { points: number; games: number; sets: number };
}

interface PlayerStats {
  winners: number;
  errors: number;
}

interface MomentumNode {
  pointIndex: number;
  player: string;
  actionType: string;
  scoreSnapshot: string;
  netMomentum: number;
  milestone: 'Set' | 'Break' | null;
  winnerTeam: 1 | 2;
}

interface HistorySnapshot {
  scoreData: SimpleScoreData;
  currentServer: 1 | 2 | 3 | 4;
  stats: Record<1 | 2 | 3 | 4, PlayerStats>;
  isTiebreak: boolean;
  momentumTimeline: MomentumNode[];
}

const SCORE_MAP = ['0', '15', '30', '40', 'A'];

interface SimpleScorekeeperProps {
  lang: Language;
  onBack: () => void;
}

export const SimpleScorekeeper: React.FC<SimpleScorekeeperProps> = ({ lang, onBack }) => {
  const isEs = lang === 'es';

  const [matchMode, setMatchMode] = useState<'singles' | 'doubles'>('singles');
  const [matchFormat, setMatchFormat] = useState<'standard' | 'short' | 'pro' | 'tiebreak7' | 'tiebreak10'>('standard');
  const [noAd, setNoAd] = useState<boolean>(false);
  const [isTiebreak, setIsTiebreak] = useState<boolean>(false);
  const [currentServer, setCurrentServer] = useState<1 | 2 | 3 | 4>(1);

  const [p1aName, setP1aName] = useState(isEs ? 'Jugador 1' : 'Player 1');
  const [p1bName, setP1bName] = useState(isEs ? 'Pareja 1' : 'Partner 1');
  const [p2aName, setP2aName] = useState(isEs ? 'Jugador 2' : 'Player 2');
  const [p2bName, setP2bName] = useState(isEs ? 'Pareja 2' : 'Partner 2');

  const [scoreData, setScoreData] = useState<SimpleScoreData>({
    t1: { points: 0, games: 0, sets: 0 },
    t2: { points: 0, games: 0, sets: 0 }
  });

  const [stats, setStats] = useState<Record<1 | 2 | 3 | 4, PlayerStats>>({
    1: { winners: 0, errors: 0 },
    2: { winners: 0, errors: 0 },
    3: { winners: 0, errors: 0 },
    4: { winners: 0, errors: 0 }
  });

  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [momentumTimeline, setMomentumTimeline] = useState<MomentumNode[]>([]);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const getPlayerName = (num: 1 | 2 | 3 | 4) => {
    if (num === 1) return p1aName.trim() || (isEs ? 'Jugador 1' : 'Player 1');
    if (num === 2) return p1bName.trim() || (isEs ? 'Pareja 1' : 'Partner 1');
    if (num === 3) return p2aName.trim() || (isEs ? 'Jugador 2' : 'Player 2');
    return p2bName.trim() || (isEs ? 'Pareja 2' : 'Partner 2');
  };

  const getNextServer = (srv: 1 | 2 | 3 | 4, mode: 'singles' | 'doubles'): 1 | 2 | 3 | 4 => {
    if (mode === 'singles') {
      return srv === 1 ? 3 : 1;
    }
    const order: (1 | 2 | 3 | 4)[] = [1, 3, 2, 4];
    const idx = order.indexOf(srv);
    return order[(idx + 1) % 4];
  };

  const handleModeSwitch = (mode: 'singles' | 'doubles') => {
    setMatchMode(mode);
    if (mode === 'singles' && (currentServer === 2 || currentServer === 4)) {
      setCurrentServer(1);
    }
  };

  const handleFormatSwitch = (format: 'standard' | 'short' | 'pro' | 'tiebreak7' | 'tiebreak10') => {
    setMatchFormat(format);
    const tb = format === 'tiebreak7' || format === 'tiebreak10';
    setIsTiebreak(tb);
    setScoreData({
      t1: { points: 0, games: 0, sets: 0 },
      t2: { points: 0, games: 0, sets: 0 }
    });
    setCurrentServer(1);
    setHistory([]);
    setMomentumTimeline([]);
  };

  const logPointDirect = (winningTeamNum: 1 | 2, playerActed: 1 | 2 | 3 | 4, type: 'Winner' | 'Error') => {
    const snapshot: HistorySnapshot = {
      scoreData: {
        t1: { ...scoreData.t1 },
        t2: { ...scoreData.t2 }
      },
      currentServer,
      stats: {
        1: { ...stats[1] },
        2: { ...stats[2] },
        3: { ...stats[3] },
        4: { ...stats[4] }
      },
      isTiebreak,
      momentumTimeline: [...momentumTimeline]
    };

    const nextScore: SimpleScoreData = {
      t1: { ...scoreData.t1 },
      t2: { ...scoreData.t2 }
    };
    const nextStats: Record<1 | 2 | 3 | 4, PlayerStats> = {
      1: { ...stats[1] },
      2: { ...stats[2] },
      3: { ...stats[3] },
      4: { ...stats[4] }
    };

    if (type === 'Winner') nextStats[playerActed].winners++;
    else nextStats[playerActed].errors++;

    const initialServer = currentServer;
    const prevGamesT1 = nextScore.t1.games;
    const prevGamesT2 = nextScore.t2.games;
    const prevSetsT1 = nextScore.t1.sets;
    const prevSetsT2 = nextScore.t2.sets;

    const scorer = winningTeamNum === 1 ? nextScore.t1 : nextScore.t2;
    const opponent = winningTeamNum === 1 ? nextScore.t2 : nextScore.t1;

    scorer.points++;

    let nextSrv = currentServer;
    let nextTb = isTiebreak;

    if (matchFormat === 'tiebreak7' || matchFormat === 'tiebreak10') {
      const targetPoints = matchFormat === 'tiebreak7' ? 7 : 10;
      if ((nextScore.t1.points + nextScore.t2.points) % 2 !== 0) {
        nextSrv = getNextServer(nextSrv, matchMode);
      }
      if (scorer.points >= targetPoints && scorer.points - opponent.points >= 2) {
        scorer.sets++;
        nextScore.t1.points = 0;
        nextScore.t2.points = 0;
      }
    } else if (nextTb) {
      if ((nextScore.t1.points + nextScore.t2.points) % 2 !== 0) {
        nextSrv = getNextServer(nextSrv, matchMode);
      }
      if (scorer.points >= 7 && scorer.points - opponent.points >= 2) {
        scorer.games++;
        nextScore.t1.points = 0;
        nextScore.t2.points = 0;
        nextTb = false;
        nextSrv = getNextServer(nextSrv, matchMode);
        scorer.sets++;
        nextScore.t1.games = 0;
        nextScore.t2.games = 0;
      }
    } else {
      let gameWon = false;
      if (noAd) {
        if (scorer.points >= 4) gameWon = true;
      } else {
        if (scorer.points >= 4 && scorer.points - opponent.points >= 2) gameWon = true;
      }

      if (gameWon) {
        scorer.games++;
        nextScore.t1.points = 0;
        nextScore.t2.points = 0;
        nextSrv = getNextServer(nextSrv, matchMode);

        let maxGames = 6;
        let tiebreakThreshold = 6;
        if (matchFormat === 'short') {
          maxGames = 4;
          tiebreakThreshold = 3;
        } else if (matchFormat === 'pro') {
          maxGames = 8;
          tiebreakThreshold = 8;
        }

        if (nextScore.t1.games === tiebreakThreshold && nextScore.t2.games === tiebreakThreshold) {
          nextTb = true;
        } else if (scorer.games >= maxGames && scorer.games - opponent.games >= 2) {
          scorer.sets++;
          nextScore.t1.games = 0;
          nextScore.t2.games = 0;
        }
      } else if (!noAd && scorer.points >= 3 && opponent.points >= 3 && scorer.points === opponent.points) {
        nextScore.t1.points = 3;
        nextScore.t2.points = 3;
      }
    }

    const totalGamesEnded =
      nextScore.t1.games !== prevGamesT1 ||
      nextScore.t2.games !== prevGamesT2 ||
      nextScore.t1.sets !== prevSetsT1 ||
      nextScore.t2.sets !== prevSetsT2;
    const setEnded = nextScore.t1.sets !== prevSetsT1 || nextScore.t2.sets !== prevSetsT2;

    let isServiceBreak = false;
    if (totalGamesEnded && !isTiebreak) {
      const t1WonGame = nextScore.t1.games > prevGamesT1 || nextScore.t1.sets > prevSetsT1;
      const t2WonGame = nextScore.t2.games > prevGamesT2 || nextScore.t2.sets > prevSetsT2;
      if (t1WonGame && (initialServer === 3 || initialServer === 4)) isServiceBreak = true;
      if (t2WonGame && (initialServer === 1 || initialServer === 2)) isServiceBreak = true;
    }

    let milestone: 'Set' | 'Break' | null = null;
    if (setEnded) milestone = 'Set';
    else if (isServiceBreak) milestone = 'Break';

    const prevNet = momentumTimeline.length > 0 ? momentumTimeline[momentumTimeline.length - 1].netMomentum : 0;
    const currentNet = prevNet + (winningTeamNum === 1 ? 1 : -1);

    const t1Str = nextTb ? String(nextScore.t1.points) : SCORE_MAP[Math.min(nextScore.t1.points, 4)];
    const t2Str = nextTb ? String(nextScore.t2.points) : SCORE_MAP[Math.min(nextScore.t2.points, 4)];

    const newNode: MomentumNode = {
      pointIndex: momentumTimeline.length + 1,
      player: getPlayerName(playerActed),
      actionType: type,
      scoreSnapshot: `S:${nextScore.t1.sets}-${nextScore.t2.sets} G:${nextScore.t1.games}-${nextScore.t2.games} P:${t1Str}-${t2Str}`,
      netMomentum: currentNet,
      milestone,
      winnerTeam: winningTeamNum
    };

    setHistory((prev) => [...prev, snapshot]);
    setScoreData(nextScore);
    setStats(nextStats);
    setCurrentServer(nextSrv);
    setIsTiebreak(nextTb);
    setMomentumTimeline((prev) => [...prev, newNode]);
  };

  const undoPoint = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setScoreData(last.scoreData);
    setCurrentServer(last.currentServer);
    setStats(last.stats);
    setIsTiebreak(last.isTiebreak);
    setMomentumTimeline(last.momentumTimeline);
    setHistory((prev) => prev.slice(0, -1));
  };

  const resetMatch = () => {
    setScoreData({
      t1: { points: 0, games: 0, sets: 0 },
      t2: { points: 0, games: 0, sets: 0 }
    });
    setStats({
      1: { winners: 0, errors: 0 },
      2: { winners: 0, errors: 0 },
      3: { winners: 0, errors: 0 },
      4: { winners: 0, errors: 0 }
    });
    setCurrentServer(1);
    setIsTiebreak(matchFormat === 'tiebreak7' || matchFormat === 'tiebreak10');
    setHistory([]);
    setMomentumTimeline([]);
    setShowResetConfirm(false);
  };

  const getPointDisplay = (side: 1 | 2) => {
    const p1 = scoreData.t1.points;
    const p2 = scoreData.t2.points;
    if (isTiebreak || matchFormat === 'tiebreak7' || matchFormat === 'tiebreak10') {
      return side === 1 ? String(p1) : String(p2);
    }
    if (!noAd && p1 >= 3 && p2 >= 3) {
      if (p1 === p2) return '40';
      if (p1 > p2) return side === 1 ? 'A' : '40';
      return side === 2 ? 'A' : '40';
    }
    return SCORE_MAP[Math.min(side === 1 ? p1 : p2, 4)];
  };

  const maxBaseline = Math.max(
    stats[1].winners,
    stats[1].errors,
    stats[2].winners,
    stats[2].errors,
    stats[3].winners,
    stats[3].errors,
    stats[4].winners,
    stats[4].errors,
    1
  );

  const activePlayerIndices: (1 | 2 | 3 | 4)[] = matchMode === 'singles' ? [1, 3] : [1, 2, 3, 4];

  const t1Winners = stats[1].winners + stats[2].winners;
  const t1Errors = stats[1].errors + stats[2].errors;
  const t2Winners = stats[3].winners + stats[4].winners;
  const t2Errors = stats[3].errors + stats[4].errors;
  const totalScaleMax = Math.max(t1Winners, t1Errors, t2Winners, t2Errors, 1);

  const downloadHtmlReport = () => {
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>Scorekeeper Pro MVP Report</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #F4F4F0; color: #111315; padding: 32px 16px; }
  .card { max-width: 680px; margin: 0 auto; background: #fff; border: 2px solid #111315; padding: 28px; }
  h1 { margin: 0 0 16px 0; font-size: 24px; border-bottom: 2px solid #0051FF; padding-bottom: 10px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #F4F4F0; padding: 14px; margin-bottom: 20px; font-size: 13px; }
  .row { margin-bottom: 10px; font-size: 13px; }
  .bar { height: 10px; background: #E2E2DC; width: 100%; margin-top: 4px; }
  .win { height: 100%; background: #0051FF; }
  .err { height: 100%; background: #DC2626; }
</style>
</head>
<body>
  <div class="card">
    <h1>Scorekeeper Pro MVP — ${isEs ? 'Reporte de Partido' : 'Match Report'}</h1>
    <div class="meta">
      <div><strong>${matchMode === 'singles' ? getPlayerName(1) : 'Team 1'}:</strong> ${scoreData.t1.sets} Sets (${scoreData.t1.games} Games)</div>
      <div><strong>${matchMode === 'singles' ? getPlayerName(3) : 'Team 2'}:</strong> ${scoreData.t2.sets} Sets (${scoreData.t2.games} Games)</div>
    </div>
    <h3>${matchMode === 'singles' ? getPlayerName(1) : 'Team 1'}</h3>
    <div class="row">Winners: <strong>${t1Winners}</strong><div class="bar"><div class="win" style="width:${(t1Winners / totalScaleMax) * 100}%"></div></div></div>
    <div class="row">Errors: <strong>${t1Errors}</strong><div class="bar"><div class="err" style="width:${(t1Errors / totalScaleMax) * 100}%"></div></div></div>
    <h3>${matchMode === 'singles' ? getPlayerName(3) : 'Team 2'}</h3>
    <div class="row">Winners: <strong>${t2Winners}</strong><div class="bar"><div class="win" style="width:${(t2Winners / totalScaleMax) * 100}%"></div></div></div>
    <div class="row">Errors: <strong>${t2Errors}</strong><div class="bar"><div class="err" style="width:${(t2Errors / totalScaleMax) * 100}%"></div></div></div>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tennis_MVP_Report_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#111315] text-[#111315] hover:text-white border border-[#111315] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEs ? 'Volver a Herramientas' : 'Back to Tools'}</span>
        </button>

        <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 bg-[#0051FF]/10 text-[#0051FF] border border-[#0051FF]/30 font-semibold">
          {isEs ? '🎾 Scorekeeper Pro · MVP Simple' : '🎾 Scorekeeper Pro · Simple MVP'}
        </span>
      </div>

      {/* Main App Card */}
      <div className="bg-white border-2 border-[#111315] shadow-md overflow-hidden">
        {/* Match Type & Format Bar */}
        <div className="p-3 sm:p-4 bg-[#F4F4F0] border-b border-[#E2E2DC] flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <button
              onClick={() => handleModeSwitch('singles')}
              className={`flex-1 py-2 px-3 text-xs font-mono uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
                matchMode === 'singles'
                  ? 'bg-[#0051FF] text-white border-[#0051FF]'
                  : 'bg-white text-[#5A6065] border-[#E2E2DC] hover:text-[#111315]'
              }`}
            >
              {isEs ? 'Individuales' : 'Singles'}
            </button>
            <button
              onClick={() => handleModeSwitch('doubles')}
              className={`flex-1 py-2 px-3 text-xs font-mono uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
                matchMode === 'doubles'
                  ? 'bg-[#0051FF] text-white border-[#0051FF]'
                  : 'bg-white text-[#5A6065] border-[#E2E2DC] hover:text-[#111315]'
              }`}
            >
              {isEs ? 'Dobles' : 'Doubles'}
            </button>
            {matchFormat !== 'tiebreak7' && matchFormat !== 'tiebreak10' && (
              <button
                onClick={() => setNoAd((prev) => !prev)}
                className={`flex-1 py-2 px-3 text-xs font-mono uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
                  noAd
                    ? 'bg-[#111315] text-[#D2F800] border-[#111315]'
                    : 'bg-white text-[#111315] border-[#E2E2DC]'
                }`}
              >
                {noAd ? (isEs ? 'Sin Ventaja' : 'No-Ad') : isEs ? 'Ventaja' : 'Advantage'}
              </button>
            )}
          </div>

          <select
            value={matchFormat}
            onChange={(e) => handleFormatSwitch(e.target.value as any)}
            className="w-full sm:w-auto sm:flex-1 min-w-[200px] bg-white border border-[#E2E2DC] px-3 py-2 text-xs font-mono text-[#111315] font-semibold focus:outline-none focus:border-[#0051FF]"
          >
            <option value="standard">{isEs ? 'Set Estándar (6 Juegos)' : 'Standard Set (6 Games)'}</option>
            <option value="short">{isEs ? 'Set Corto (4 Juegos / Fast4)' : 'Short Set (4 Games / Fast4)'}</option>
            <option value="pro">{isEs ? 'Pro Set (8 Juegos)' : 'Pro Set (8 Games)'}</option>
            <option value="tiebreak7">{isEs ? 'Tiebreak a 7 Puntos' : '7-Point Tiebreak Match'}</option>
            <option value="tiebreak10">{isEs ? 'Super Tiebreak a 10 Puntos' : '10-Point Tiebreak Match'}</option>
          </select>
        </div>

        {/* Editable Players & Sets/Games Badges (Tap dot to change server) */}
        <div className="p-4 sm:p-5 border-b border-[#E2E2DC] grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#0051FF] font-bold">
                {matchMode === 'singles' ? getPlayerName(1) : isEs ? 'Equipo 1' : 'Team 1'}
              </span>
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#F4F4F0] border border-[#E2E2DC]">
                {scoreData.t1.sets} Sets ({scoreData.t1.games} {isEs ? 'Juegos' : 'Games'})
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-[#F4F4F0]/60 p-2 border border-[#E2E2DC]">
              <button
                type="button"
                onClick={() => setCurrentServer(1)}
                title={isEs ? 'Asignar saque' : 'Set as server'}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer shrink-0 ${
                  currentServer === 1
                    ? 'bg-[#D2F800] border-[#111315] ring-2 ring-[#D2F800]/60'
                    : 'bg-[#E2E2DC] border-[#5A6065]/40'
                }`}
              />
              <input
                type="text"
                value={p1aName}
                onChange={(e) => setP1aName(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#111315] focus:outline-none border-b border-transparent focus:border-[#0051FF]"
              />
            </div>

            {matchMode === 'doubles' && (
              <div className="flex items-center gap-2.5 bg-[#F4F4F0]/60 p-2 border border-[#E2E2DC]">
                <button
                  type="button"
                  onClick={() => setCurrentServer(2)}
                  title={isEs ? 'Asignar saque' : 'Set as server'}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer shrink-0 ${
                    currentServer === 2
                      ? 'bg-[#D2F800] border-[#111315] ring-2 ring-[#D2F800]/60'
                      : 'bg-[#E2E2DC] border-[#5A6065]/40'
                  }`}
                />
                <input
                  type="text"
                  value={p1bName}
                  onChange={(e) => setP1bName(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#111315] focus:outline-none border-b border-transparent focus:border-[#0051FF]"
                />
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#5A6065] font-bold">
                {matchMode === 'singles' ? getPlayerName(3) : isEs ? 'Equipo 2' : 'Team 2'}
              </span>
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#F4F4F0] border border-[#E2E2DC]">
                {scoreData.t2.sets} Sets ({scoreData.t2.games} {isEs ? 'Juegos' : 'Games'})
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-[#F4F4F0]/60 p-2 border border-[#E2E2DC]">
              <button
                type="button"
                onClick={() => setCurrentServer(3)}
                title={isEs ? 'Asignar saque' : 'Set as server'}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer shrink-0 ${
                  currentServer === 3
                    ? 'bg-[#D2F800] border-[#111315] ring-2 ring-[#D2F800]/60'
                    : 'bg-[#E2E2DC] border-[#5A6065]/40'
                }`}
              />
              <input
                type="text"
                value={p2aName}
                onChange={(e) => setP2aName(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#111315] focus:outline-none border-b border-transparent focus:border-[#0051FF]"
              />
            </div>

            {matchMode === 'doubles' && (
              <div className="flex items-center gap-2.5 bg-[#F4F4F0]/60 p-2 border border-[#E2E2DC]">
                <button
                  type="button"
                  onClick={() => setCurrentServer(4)}
                  title={isEs ? 'Asignar saque' : 'Set as server'}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer shrink-0 ${
                    currentServer === 4
                      ? 'bg-[#D2F800] border-[#111315] ring-2 ring-[#D2F800]/60'
                      : 'bg-[#E2E2DC] border-[#5A6065]/40'
                  }`}
                />
                <input
                  type="text"
                  value={p2bName}
                  onChange={(e) => setP2bName(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#111315] focus:outline-none border-b border-transparent focus:border-[#0051FF]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Scoreboard & Direct Winner/Error Action Panels (Mobile-first order: Scoreboard on top on mobile) */}
        <div className="flex flex-col md:flex-row border-b border-[#E2E2DC]">
          {/* Center Scoreboard Display (First on mobile, middle on desktop) */}
          <div className="order-1 md:order-2 flex-1 bg-[#111315] text-white py-8 px-4 flex items-center justify-around">
            <div className="text-center flex-1 min-w-0 px-2">
              <div className="font-mono text-xs uppercase tracking-wider text-white/70 truncate mb-2">
                {matchMode === 'singles' ? getPlayerName(1) : isEs ? 'Equipo 1' : 'Team 1'}
              </div>
              <div className="font-mono text-6xl sm:text-7xl font-extrabold tabular-nums text-white leading-none">
                {getPointDisplay(1)}
              </div>
            </div>

            <div className="font-mono text-3xl text-white/30 px-2">:</div>

            <div className="text-center flex-1 min-w-0 px-2">
              <div className="font-mono text-xs uppercase tracking-wider text-white/70 truncate mb-2">
                {matchMode === 'singles' ? getPlayerName(3) : isEs ? 'Equipo 2' : 'Team 2'}
              </div>
              <div className="font-mono text-6xl sm:text-7xl font-extrabold tabular-nums text-white leading-none">
                {getPointDisplay(2)}
              </div>
            </div>
          </div>

          {/* Left Action Panel: Team 1 Direct Winner / Error */}
          <div className="order-2 md:order-1 flex-1 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#E2E2DC] space-y-3">
            <div className="font-mono text-xs uppercase tracking-wider text-[#5A6065] font-bold">
              {matchMode === 'singles'
                ? `${getPlayerName(1)} · ${isEs ? 'Acciones' : 'Actions'}`
                : isEs
                ? 'Acciones Equipo 1'
                : 'Team 1 Actions'}
            </div>

            {/* Player 1A Card */}
            <div
              className={`p-3 border transition-colors ${
                currentServer === 1 ? 'border-[#0051FF] bg-[#0051FF]/5' : 'border-[#E2E2DC] bg-[#F4F4F0]/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#111315] mb-2">
                <span>{getPlayerName(1)}</span>
                {currentServer === 1 && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#D2F800] text-[#111315]">
                    {isEs ? 'Sacando' : 'Serving'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => logPointDirect(1, 1, 'Winner')}
                  className="py-2.5 px-3 bg-[#0051FF] hover:bg-[#0040CC] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                >
                  Winner
                </button>
                <button
                  onClick={() => logPointDirect(2, 1, 'Error')}
                  className="py-2.5 px-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                >
                  Error
                </button>
              </div>
            </div>

            {/* Player 1B Card (Doubles) */}
            {matchMode === 'doubles' && (
              <div
                className={`p-3 border transition-colors ${
                  currentServer === 2 ? 'border-[#0051FF] bg-[#0051FF]/5' : 'border-[#E2E2DC] bg-[#F4F4F0]/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#111315] mb-2">
                  <span>{getPlayerName(2)}</span>
                  {currentServer === 2 && (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#D2F800] text-[#111315]">
                      {isEs ? 'Sacando' : 'Serving'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => logPointDirect(1, 2, 'Winner')}
                    className="py-2.5 px-3 bg-[#0051FF] hover:bg-[#0040CC] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                  >
                    Winner
                  </button>
                  <button
                    onClick={() => logPointDirect(2, 2, 'Error')}
                    className="py-2.5 px-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                  >
                    Error
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Panel: Team 2 Direct Winner / Error */}
          <div className="order-3 flex-1 p-4 sm:p-5 md:border-l border-[#E2E2DC] space-y-3">
            <div className="font-mono text-xs uppercase tracking-wider text-[#5A6065] font-bold">
              {matchMode === 'singles'
                ? `${getPlayerName(3)} · ${isEs ? 'Acciones' : 'Actions'}`
                : isEs
                ? 'Acciones Equipo 2'
                : 'Team 2 Actions'}
            </div>

            {/* Player 2A Card */}
            <div
              className={`p-3 border transition-colors ${
                currentServer === 3 ? 'border-[#0051FF] bg-[#0051FF]/5' : 'border-[#E2E2DC] bg-[#F4F4F0]/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#111315] mb-2">
                <span>{getPlayerName(3)}</span>
                {currentServer === 3 && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#D2F800] text-[#111315]">
                    {isEs ? 'Sacando' : 'Serving'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => logPointDirect(2, 3, 'Winner')}
                  className="py-2.5 px-3 bg-[#0051FF] hover:bg-[#0040CC] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                >
                  Winner
                </button>
                <button
                  onClick={() => logPointDirect(1, 3, 'Error')}
                  className="py-2.5 px-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                >
                  Error
                </button>
              </div>
            </div>

            {/* Player 2B Card (Doubles) */}
            {matchMode === 'doubles' && (
              <div
                className={`p-3 border transition-colors ${
                  currentServer === 4 ? 'border-[#0051FF] bg-[#0051FF]/5' : 'border-[#E2E2DC] bg-[#F4F4F0]/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#111315] mb-2">
                  <span>{getPlayerName(4)}</span>
                  {currentServer === 4 && (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#D2F800] text-[#111315]">
                      {isEs ? 'Sacando' : 'Serving'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => logPointDirect(2, 4, 'Winner')}
                    className="py-2.5 px-3 bg-[#0051FF] hover:bg-[#0040CC] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                  >
                    Winner
                  </button>
                  <button
                    onClick={() => logPointDirect(1, 4, 'Error')}
                    className="py-2.5 px-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                  >
                    Error
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Match Progress Charts (Winners vs Errors per player, matching original score-keeper-simple.html) */}
        <div className="p-4 sm:p-6 border-b border-[#E2E2DC] bg-[#F4F4F0]/40">
          <div className="font-mono text-xs uppercase tracking-widest text-[#0051FF] font-bold mb-4">
            {isEs ? 'Gráficos de Progreso en Vivo' : 'Live Match Progress Charts'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePlayerIndices.map((idx) => {
              const pStat = stats[idx];
              const wPct = (pStat.winners / maxBaseline) * 100;
              const ePct = (pStat.errors / maxBaseline) * 100;
              return (
                <div key={idx} className="bg-white border border-[#E2E2DC] p-4">
                  <div className="font-bold text-sm text-[#111315] mb-3">{getPlayerName(idx)}</div>

                  <div className="mb-2.5">
                    <div className="flex justify-between text-xs font-mono text-[#5A6065] mb-1">
                      <span>Winners</span>
                      <span className="font-bold text-[#111315]">{pStat.winners}</span>
                    </div>
                    <div className="h-2.5 bg-[#E2E2DC] w-full overflow-hidden">
                      <div
                        className="h-full bg-[#0051FF] transition-all duration-300"
                        style={{ width: `${wPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-[#5A6065] mb-1">
                      <span>{isEs ? 'Errores' : 'Errors'}</span>
                      <span className="font-bold text-[#111315]">{pStat.errors}</span>
                    </div>
                    <div className="h-2.5 bg-[#E2E2DC] w-full overflow-hidden">
                      <div
                        className="h-full bg-[#DC2626] transition-all duration-300"
                        style={{ width: `${ePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Utility Buttons */}
        <div className="p-4 sm:p-5 bg-white flex flex-wrap items-center gap-3">
          <button
            onClick={undoPoint}
            disabled={history.length === 0}
            className="flex-1 min-w-[130px] py-3 px-4 border border-[#111315] bg-white hover:bg-[#F4F4F0] disabled:opacity-40 text-[#111315] font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEs ? 'Deshacer Punto' : 'Undo Point'}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex-1 min-w-[160px] py-3 px-4 bg-[#0051FF] hover:bg-[#0040CC] text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span>{isEs ? 'Ver Reporte Resumen' : 'View Summary Report'}</span>
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex-1 min-w-[130px] py-3 px-4 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              {isEs ? 'Reiniciar Partido' : 'Reset Match'}
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={resetMatch}
                className="py-3 px-3 bg-[#DC2626] text-white font-mono text-xs uppercase font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEs ? 'Confirmar' : 'Confirm'}</span>
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-3 px-3 bg-[#E2E2DC] text-[#111315] font-mono text-xs uppercase font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Report Modal */}
      {showReportModal && (
        <div
          className="fixed inset-0 z-50 bg-[#111315]/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="bg-white border-2 border-[#111315] max-w-2xl w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E2DC] pb-3 mb-4">
              <h3 className="font-serif text-2xl text-[#111315]">
                {isEs ? '📊 Reporte de Rendimiento y Momentum' : '📊 Performance & Momentum Report'}
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 text-[#5A6065] hover:text-[#111315] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#F4F4F0] p-3.5 border border-[#E2E2DC] text-xs font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-[#5A6065]">{isEs ? 'Modalidad:' : 'Mode:'}</span>
                <strong className="uppercase">{matchMode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6065]">{isEs ? 'Regla:' : 'Protocol:'}</span>
                <strong>{noAd ? 'No-Ad' : 'Advantage'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6065]">{matchMode === 'singles' ? getPlayerName(1) : 'Team 1'}:</span>
                <strong>
                  {scoreData.t1.sets} Sets / {scoreData.t1.games} Games
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6065]">{matchMode === 'singles' ? getPlayerName(3) : 'Team 2'}:</span>
                <strong>
                  {scoreData.t2.sets} Sets / {scoreData.t2.games} Games
                </strong>
              </div>
            </div>

            <div className="border border-[#E2E2DC] p-4 mb-4 space-y-4">
              <div className="font-mono text-xs uppercase tracking-wider text-[#0051FF] font-bold">
                {isEs ? 'Comparación de Totales Acumulados' : 'Accumulated Stat Totals Comparison'}
              </div>

              <div>
                <div className="text-xs font-bold text-[#0051FF] mb-2">
                  {matchMode === 'singles' ? getPlayerName(1) : 'Team 1 Totals'}
                </div>
                <div className="grid grid-cols-[75px_1fr_32px] items-center gap-2 text-xs font-mono mb-1.5">
                  <span>Winners</span>
                  <div className="h-2.5 bg-[#E2E2DC]">
                    <div
                      className="h-full bg-[#0051FF]"
                      style={{ width: `${(t1Winners / totalScaleMax) * 100}%` }}
                    />
                  </div>
                  <strong className="text-right">{t1Winners}</strong>
                </div>
                <div className="grid grid-cols-[75px_1fr_32px] items-center gap-2 text-xs font-mono">
                  <span>{isEs ? 'Errores' : 'Errors'}</span>
                  <div className="h-2.5 bg-[#E2E2DC]">
                    <div
                      className="h-full bg-[#DC2626]"
                      style={{ width: `${(t1Errors / totalScaleMax) * 100}%` }}
                    />
                  </div>
                  <strong className="text-right">{t1Errors}</strong>
                </div>
              </div>

              <div className="border-t border-dashed border-[#E2E2DC] pt-3">
                <div className="text-xs font-bold text-[#111315] mb-2">
                  {matchMode === 'singles' ? getPlayerName(3) : 'Team 2 Totals'}
                </div>
                <div className="grid grid-cols-[75px_1fr_32px] items-center gap-2 text-xs font-mono mb-1.5">
                  <span>Winners</span>
                  <div className="h-2.5 bg-[#E2E2DC]">
                    <div
                      className="h-full bg-[#0051FF]"
                      style={{ width: `${(t2Winners / totalScaleMax) * 100}%` }}
                    />
                  </div>
                  <strong className="text-right">{t2Winners}</strong>
                </div>
                <div className="grid grid-cols-[75px_1fr_32px] items-center gap-2 text-xs font-mono">
                  <span>{isEs ? 'Errores' : 'Errors'}</span>
                  <div className="h-2.5 bg-[#E2E2DC]">
                    <div
                      className="h-full bg-[#DC2626]"
                      style={{ width: `${(t2Errors / totalScaleMax) * 100}%` }}
                    />
                  </div>
                  <strong className="text-right">{t2Errors}</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2.5 border border-[#111315] text-xs font-mono uppercase font-bold cursor-pointer"
              >
                {isEs ? 'Cerrar' : 'Close Preview'}
              </button>
              <button
                onClick={downloadHtmlReport}
                className="px-4 py-2.5 bg-[#0051FF] text-white text-xs font-mono uppercase font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isEs ? 'Descargar Reporte (.HTML)' : 'Download Report (.HTML)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
