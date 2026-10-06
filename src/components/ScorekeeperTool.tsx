import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../data/articlesData';
import { ArrowLeft, RotateCcw, Download, BarChart2, Plus, Minus, Check, X } from 'lucide-react';

interface TeamStats {
  points: number;
  games: number;
  sets: number;
  totalWon: number;
  r1: number; // 0-4 touches
  r2: number; // 5-8 touches
  r3: number; // 9+ touches
  winners: number;
  unforced: number;
  forced: number;
  fh: number;
  bh: number;
  serveIn: number;
  totalServes: number;
  aces: number;
  doubleFaults: number;
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
  t1: TeamStats;
  t2: TeamStats;
  currentServer: 1 | 2 | 3 | 4;
  activeServeType: 'First' | 'Second';
  isTiebreak: boolean;
  logText: string;
}

const INITIAL_TEAM_STATS: TeamStats = {
  points: 0,
  games: 0,
  sets: 0,
  totalWon: 0,
  r1: 0,
  r2: 0,
  r3: 0,
  winners: 0,
  unforced: 0,
  forced: 0,
  fh: 0,
  bh: 0,
  serveIn: 0,
  totalServes: 0,
  aces: 0,
  doubleFaults: 0
};

const SCORE_MAP = ['0', '15', '30', '40', 'A'];

interface ScorekeeperToolProps {
  mode: 'simple' | 'complex';
  lang: Language;
  onBack: () => void;
}

export const ScorekeeperTool: React.FC<ScorekeeperToolProps> = ({
  mode,
  lang,
  onBack
}) => {
  const isEs = lang === 'es';
  const isComplex = mode === 'complex';

  const [matchMode, setMatchMode] = useState<'singles' | 'doubles'>('singles');
  const [matchFormat, setMatchFormat] = useState<'standard' | 'short' | 'pro' | 'tiebreak7' | 'tiebreak10'>('standard');
  const [ruleNoAd, setRuleNoAd] = useState<boolean>(false);

  const [p1aName, setP1aName] = useState(isEs ? 'Jugador 1' : 'Player 1');
  const [p1bName, setP1bName] = useState(isEs ? 'Pareja 1' : 'Partner 1');
  const [p2aName, setP2aName] = useState(isEs ? 'Jugador 2' : 'Player 2');
  const [p2bName, setP2bName] = useState(isEs ? 'Pareja 2' : 'Partner 2');

  const [currentServer, setCurrentServer] = useState<1 | 2 | 3 | 4>(1);
  const [activeServeType, setActiveServeType] = useState<'First' | 'Second'>('First');
  const [isTiebreak, setIsTiebreak] = useState<boolean>(false);
  const [liveRallyCount, setLiveRallyCount] = useState<number>(0);

  const [t1, setT1] = useState<TeamStats>({ ...INITIAL_TEAM_STATS });
  const [t2, setT2] = useState<TeamStats>({ ...INITIAL_TEAM_STATS });
  const [pointHistory, setPointHistory] = useState<HistorySnapshot[]>([]);
  const [momentumTimeline, setMomentumTimeline] = useState<MomentumNode[]>([]);

  const [activeBottomTab, setActiveBottomTab] = useState<'match-stats' | 'shot-stats' | 'match-log'>('match-stats');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Point Flow Modal State (Used when mode === 'complex')
  const [pointModalSide, setPointModalSide] = useState<1 | 2 | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'Winner' | 'Unforced Error' | 'Forced Error' | 'Double Fault' | ''>('');
  const [selectedActor, setSelectedActor] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSide, setSelectedSide] = useState<'Forehand' | 'Backhand' | ''>('');
  const [selectedStroke, setSelectedStroke] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedErrorDir, setSelectedErrorDir] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const getPlayerName = (num: 1 | 2 | 3 | 4) => {
    if (num === 1) return p1aName || (isEs ? 'Jugador 1' : 'Player 1');
    if (num === 2) return p1bName || (isEs ? 'Pareja 1' : 'Partner 1');
    if (num === 3) return p2aName || (isEs ? 'Jugador 2' : 'Player 2');
    return p2bName || (isEs ? 'Pareja 2' : 'Partner 2');
  };

  const getTeamLabel = (side: 1 | 2) => {
    if (matchMode === 'singles') {
      return side === 1 ? getPlayerName(1) : getPlayerName(3);
    }
    return side === 1
      ? isEs ? 'Equipo 1' : 'Team 1'
      : isEs ? 'Equipo 2' : 'Team 2';
  };

  const getNextServer = (srv: 1 | 2 | 3 | 4): 1 | 2 | 3 | 4 => {
    if (matchMode === 'singles') {
      return srv === 1 ? 3 : 1;
    }
    const order: (1 | 2 | 3 | 4)[] = [1, 3, 2, 4];
    const idx = order.indexOf(srv);
    return order[(idx + 1) % 4];
  };

  const formatScoreDisplay = (s1: TeamStats, s2: TeamStats, tb: boolean) => {
    if (tb) {
      return { p1: String(s1.points), p2: String(s2.points) };
    }
    if (s1.points >= 3 && s2.points >= 3) {
      if (s1.points === s2.points) return { p1: '40', p2: '40' };
      if (s1.points > s2.points) return { p1: 'A', p2: '40' };
      return { p1: '40', p2: 'A' };
    }
    return {
      p1: SCORE_MAP[Math.min(s1.points, 3)],
      p2: SCORE_MAP[Math.min(s2.points, 3)]
    };
  };

  const processPointOutcome = (
    winningTeam: 1 | 2,
    logText: string,
    metrics: {
      outcome: string;
      actor: 1 | 2 | 3 | 4;
      side?: string;
      rally: number;
      isAce?: boolean;
      isDoubleFault?: boolean;
    }
  ) => {
    const nextT1: TeamStats = { ...t1 };
    const nextT2: TeamStats = { ...t2 };

    setPointHistory((prev) => [
      ...prev,
      {
        t1: { ...t1 },
        t2: { ...t2 },
        currentServer,
        activeServeType,
        isTiebreak,
        logText
      }
    ]);

    const serverTeam: 1 | 2 = currentServer === 1 || currentServer === 2 ? 1 : 2;
    const srvStats = serverTeam === 1 ? nextT1 : nextT2;

    if (!metrics.isDoubleFault) {
      srvStats.totalServes += 1;
      if (activeServeType === 'First') {
        srvStats.serveIn += 1;
      }
    } else {
      srvStats.totalServes += 1;
      srvStats.doubleFaults += 1;
    }

    if (metrics.isAce) {
      srvStats.aces += 1;
    }

    const scorer = winningTeam === 1 ? nextT1 : nextT2;
    const opponent = winningTeam === 1 ? nextT2 : nextT1;
    const actorSide: 1 | 2 = metrics.actor === 1 || metrics.actor === 2 ? 1 : 2;
    const actorStats = actorSide === 1 ? nextT1 : nextT2;

    scorer.points += 1;
    scorer.totalWon += 1;

    if (metrics.outcome === 'Winner') actorStats.winners += 1;
    if (metrics.outcome === 'Unforced Error') actorStats.unforced += 1;
    if (metrics.outcome === 'Forced Error') actorStats.forced += 1;
    if (metrics.side === 'Forehand') actorStats.fh += 1;
    if (metrics.side === 'Backhand') actorStats.bh += 1;

    if (metrics.rally <= 4) scorer.r1 += 1;
    else if (metrics.rally <= 8) scorer.r2 += 1;
    else scorer.r3 += 1;

    const prevGamesT1 = t1.games;
    const prevGamesT2 = t2.games;
    const prevSetsT1 = t1.sets;
    const prevSetsT2 = t2.sets;

    let nextServer = currentServer;
    let nextIsTiebreak = isTiebreak;

    if (matchFormat === 'tiebreak7' || matchFormat === 'tiebreak10') {
      const targetPts = matchFormat === 'tiebreak7' ? 7 : 10;
      if (scorer.points >= targetPts && scorer.points - opponent.points >= 2) {
        scorer.sets += 1;
        nextT1.points = 0;
        nextT2.points = 0;
      } else if ((nextT1.points + nextT2.points) % 2 === 1) {
        nextServer = getNextServer(currentServer);
      }
    } else if (isTiebreak) {
      if (scorer.points >= 7 && scorer.points - opponent.points >= 2) {
        scorer.games += 1;
        scorer.sets += 1;
        nextT1.points = 0;
        nextT2.points = 0;
        nextT1.games = 0;
        nextT2.games = 0;
        nextIsTiebreak = false;
        nextServer = getNextServer(currentServer);
      } else if ((nextT1.points + nextT2.points) % 2 === 1) {
        nextServer = getNextServer(currentServer);
      }
    } else {
      let gameWon = false;
      if (ruleNoAd && scorer.points === 4) {
        gameWon = true;
      } else if (!ruleNoAd && scorer.points >= 4 && scorer.points - opponent.points >= 2) {
        gameWon = true;
      } else if (!ruleNoAd && scorer.points >= 3 && opponent.points >= 3 && scorer.points === opponent.points) {
        nextT1.points = 3;
        nextT2.points = 3;
      }

      if (gameWon) {
        scorer.games += 1;
        nextT1.points = 0;
        nextT2.points = 0;
        nextServer = getNextServer(currentServer);

        const maxGames = matchFormat === 'short' ? 4 : matchFormat === 'pro' ? 8 : 6;
        if (nextT1.games === maxGames && nextT2.games === maxGames) {
          nextIsTiebreak = true;
        } else if (scorer.games >= maxGames && scorer.games - opponent.games >= 2) {
          scorer.sets += 1;
          nextT1.games = 0;
          nextT2.games = 0;
        }
      }
    }

    const setEnded = nextT1.sets !== prevSetsT1 || nextT2.sets !== prevSetsT2;
    const gameEnded = nextT1.games !== prevGamesT1 || nextT2.games !== prevGamesT2 || setEnded;
    let milestone: 'Set' | 'Break' | null = null;
    if (setEnded) {
      milestone = 'Set';
    } else if (gameEnded && !isTiebreak) {
      const t1WonGame = nextT1.games > prevGamesT1 || nextT1.sets > prevSetsT1;
      const t2WonGame = nextT2.games > prevGamesT2 || nextT2.sets > prevSetsT2;
      if (t1WonGame && (currentServer === 3 || currentServer === 4)) milestone = 'Break';
      if (t2WonGame && (currentServer === 1 || currentServer === 2)) milestone = 'Break';
    }

    const prevNet = momentumTimeline.length > 0 ? momentumTimeline[momentumTimeline.length - 1].netMomentum : 0;
    const currentNet = prevNet + (winningTeam === 1 ? 1 : -1);
    const formattedAfter = formatScoreDisplay(nextT1, nextT2, nextIsTiebreak);

    setMomentumTimeline((prev) => [
      ...prev,
      {
        pointIndex: prev.length + 1,
        player: getPlayerName(metrics.actor),
        actionType: metrics.outcome,
        scoreSnapshot: `S:${nextT1.sets}-${nextT2.sets} G:${nextT1.games}-${nextT2.games} (${formattedAfter.p1}-${formattedAfter.p2})`,
        netMomentum: currentNet,
        milestone,
        winnerTeam: winningTeam
      }
    ]);

    setT1(nextT1);
    setT2(nextT2);
    setCurrentServer(nextServer);
    setIsTiebreak(nextIsTiebreak);
    setActiveServeType('First');
    setLiveRallyCount(0);
  };

  const handleFastServe = (action: 'fault' | 'ace') => {
    const serverSide: 1 | 2 = currentServer === 1 || currentServer === 2 ? 1 : 2;
    if (action === 'ace') {
      processPointOutcome(
        serverSide,
        `${isEs ? 'Ace de saque por' : 'Serve Ace by'} ${getPlayerName(currentServer)}`,
        {
          outcome: 'Winner',
          actor: currentServer,
          rally: 1,
          isAce: true
        }
      );
    } else {
      if (activeServeType === 'First') {
        setActiveServeType('Second');
      } else {
        const receiverSide: 1 | 2 = serverSide === 1 ? 2 : 1;
        processPointOutcome(
          receiverSide,
          `${isEs ? 'Doble falta por' : 'Double Fault by'} ${getPlayerName(currentServer)}`,
          {
            outcome: 'Unforced Error',
            actor: currentServer,
            rally: 0,
            isDoubleFault: true
          }
        );
      }
    }
  };

  const handleScoreClick = (side: 1 | 2) => {
    if (!isComplex) {
      // Simple MVP: Direct Game-State Logging
      const actor = side === 1 ? 1 : 3;
      const logLabel = isEs
        ? `Punto ganado por ${getTeamLabel(side)} (Peloteo: ${liveRallyCount})`
        : `Point won by ${getTeamLabel(side)} (Rally: ${liveRallyCount})`;
      processPointOutcome(side, logLabel, {
        outcome: 'Winner',
        actor,
        rally: liveRallyCount
      });
      return;
    }

    // Complex Mode: Open Detailed Stroke Classification Popup
    setPointModalSide(side);
    setSelectedOutcome('');
    setSelectedActor(side === 1 ? 1 : 3);
    setSelectedSide('');
    setSelectedStroke('');
    setSelectedLocation('');
    setSelectedErrorDir('');
  };

  const handleCommitModalPoint = () => {
    if (!pointModalSide || !selectedOutcome) return;

    let actor: 1 | 2 | 3 | 4 = selectedActor;
    if (matchMode === 'singles') {
      if (selectedOutcome === 'Winner') {
        actor = pointModalSide === 1 ? 1 : 3;
      } else {
        actor = pointModalSide === 1 ? 3 : 1;
      }
    }

    const details = [
      selectedSide,
      selectedStroke,
      selectedLocation,
      selectedErrorDir ? `${isEs ? 'Fallo' : 'Missed'} ${selectedErrorDir}` : ''
    ]
      .filter(Boolean)
      .join(' · ');

    const logText = `${getPlayerName(actor)} -> ${selectedOutcome}${details ? ` [${details}]` : ''}`;

    processPointOutcome(pointModalSide, logText, {
      outcome: selectedOutcome === 'Double Fault' ? 'Unforced Error' : selectedOutcome,
      actor,
      side: selectedSide,
      rally: liveRallyCount,
      isDoubleFault: selectedOutcome === 'Double Fault'
    });

    setPointModalSide(null);
  };

  const handleUndo = () => {
    if (pointHistory.length === 0) return;
    const last = pointHistory[pointHistory.length - 1];
    setT1(last.t1);
    setT2(last.t2);
    setCurrentServer(last.currentServer);
    setActiveServeType(last.activeServeType);
    setIsTiebreak(last.isTiebreak);
    setPointHistory((prev) => prev.slice(0, -1));
    setMomentumTimeline((prev) => prev.slice(0, -1));
  };

  const handleResetConfirmed = () => {
    setT1({ ...INITIAL_TEAM_STATS });
    setT2({ ...INITIAL_TEAM_STATS });
    setPointHistory([]);
    setMomentumTimeline([]);
    setCurrentServer(1);
    setActiveServeType('First');
    setIsTiebreak(matchFormat === 'tiebreak7' || matchFormat === 'tiebreak10');
    setLiveRallyCount(0);
    setShowResetConfirm(false);
  };

  const drawMomentumOnCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const centerY = h / 2;
    const axisX = 110;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#e8e8ed';
    for (let x = axisX; x < w; x += 25) {
      for (let y = 0; y < h; y += 22) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    ctx.beginPath();
    ctx.strokeStyle = '#1d1d1f';
    ctx.lineWidth = 2;
    ctx.moveTo(axisX, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#1d1d1f';
    ctx.lineWidth = 2;
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, h);
    ctx.stroke();

    ctx.fillStyle = '#0071e3';
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(getTeamLabel(1).slice(0, 14), 10, centerY - 40);

    ctx.fillStyle = '#ff3b30';
    ctx.fillText(getTeamLabel(2).slice(0, 14), 10, centerY + 45);

    if (momentumTimeline.length === 0) {
      ctx.fillStyle = '#86868b';
      ctx.font = 'italic 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        isEs ? 'Aún no hay puntos registrados.' : 'No match points recorded yet.',
        (w + axisX) / 2,
        centerY - 8
      );
      return;
    }

    let maxSwing = 5;
    momentumTimeline.forEach((pt) => {
      if (Math.abs(pt.netMomentum) > maxSwing) maxSwing = Math.abs(pt.netMomentum);
    });

    const horizontalSpan = w - axisX - 30;
    const stepX = horizontalSpan / momentumTimeline.length;
    const scaleY = (centerY - 35) / maxSwing;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1d1d1f';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.moveTo(axisX, centerY);

    momentumTimeline.forEach((pt, idx) => {
      const cx = axisX + (idx + 1) * stepX;
      const cy = centerY - pt.netMomentum * scaleY;
      ctx.lineTo(cx, cy);
    });
    ctx.stroke();

    momentumTimeline.forEach((pt, idx) => {
      const cx = axisX + (idx + 1) * stepX;
      const cy = centerY - pt.netMomentum * scaleY;

      if (pt.milestone === 'Set') {
        ctx.beginPath();
        ctx.strokeStyle = '#1d1d1f';
        ctx.lineWidth = 2;
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, h);
        ctx.stroke();

        ctx.fillStyle = '#1d1d1f';
        ctx.font = 'bold 10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SET', cx, h - 8);
      } else if (pt.milestone === 'Break') {
        ctx.beginPath();
        ctx.strokeStyle = '#ff3b30';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, h);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#1d1d1f';
        ctx.font = 'bold 9px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BREAK', cx, cy - 11);
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
      ctx.fillStyle = pt.winnerTeam === 1 ? '#0071e3' : '#ff3b30';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  };

  useEffect(() => {
    drawMomentumOnCanvas(canvasRef.current);
    if (showReportModal) {
      drawMomentumOnCanvas(modalCanvasRef.current);
    }
  }, [momentumTimeline, showReportModal, p1aName, p2aName, matchMode, lang]);

  const downloadHTMLReport = () => {
    const canvas = modalCanvasRef.current || canvasRef.current;
    const imgData = canvas ? canvas.toDataURL('image/png') : '';
    const totalPts = t1.totalWon + t2.totalWon;
    const t1Pct = totalPts > 0 ? ((t1.totalWon / totalPts) * 100).toFixed(1) : '0.0';
    const t2Pct = totalPts > 0 ? ((t2.totalWon / totalPts) * 100).toFixed(1) : '0.0';

    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>Match Performance Report — ${getTeamLabel(1)} vs ${getTeamLabel(2)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f7; color: #1d1d1f; padding: 40px 20px; }
  .card { max-width: 650px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 30px; border: 1px solid #e8e8ed; }
  h1 { margin: 0 0 8px 0; font-size: 22px; border-bottom: 2px solid #0071e3; padding-bottom: 12px; }
  .meta { color: #86868b; font-size: 13px; margin-bottom: 20px; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f2; font-size: 14px; }
  img { width: 100%; height: auto; margin-top: 16px; border: 1px solid #e8e8ed; border-radius: 12px; }
</style>
</head>
<body>
  <div class="card">
    <h1>${isEs ? 'Reporte de Rendimiento del Partido' : 'Comprehensive Performance Match Report'}</h1>
    <div class="meta">${getTeamLabel(1)} (${t1.sets} Sets / ${t1.games} Games) vs ${getTeamLabel(2)} (${t2.sets} Sets / ${t2.games} Games)</div>
    <div class="row"><strong>${t1.totalWon} (${t1Pct}%)</strong><span>${isEs ? 'Total de Puntos Ganados' : 'Total Points Won'}</span><strong>${t2.totalWon} (${t2Pct}%)</strong></div>
    <div class="row"><strong>${t1.winners}</strong><span>Winners</span><strong>${t2.winners}</strong></div>
    <div class="row"><strong>${t1.unforced}</strong><span>${isEs ? 'Errores No Forzados' : 'Unforced Errors'}</span><strong>${t2.unforced}</strong></div>
    ${imgData ? `<img src="${imgData}" alt="Momentum Graph" />` : ''}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Match_Report_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedScores = formatScoreDisplay(t1, t2, isTiebreak);
  const totalPoints = t1.totalWon + t2.totalWon;
  const t1WinPct = totalPoints > 0 ? ((t1.totalWon / totalPoints) * 100).toFixed(1) + '%' : '0.0%';
  const t2WinPct = totalPoints > 0 ? ((t2.totalWon / totalPoints) * 100).toFixed(1) + '%' : '0.0%';
  const t1ServePct = t1.totalServes > 0 ? Math.round((t1.serveIn / t1.totalServes) * 100) + '%' : '0%';
  const t2ServePct = t2.totalServes > 0 ? Math.round((t2.serveIn / t2.totalServes) * 100) + '%' : '0%';

  return (
    <div className="w-full max-w-[950px] mx-auto px-3 sm:px-6 py-6 sm:py-10">
      <div className="bg-white rounded-[28px] border border-[#e8e8ed] shadow-[0_20px_40px_rgba(0,0,0,0.04)] overflow-hidden relative flex flex-col">
        {/* Top App Header */}
        <div className="bg-[#0071e3] px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEs ? 'Volver a Herramientas' : 'Back to Tools'}</span>
          </button>
          <span className="truncate">
            {isComplex
              ? isEs ? 'Scorekeeper Pro · Estadísticas Avanzadas' : 'Scorekeeper Pro · Advanced Stats'
              : isEs ? 'Scorekeeper Pro · MVP Simple' : 'Scorekeeper Pro · Simple MVP'}
          </span>
          <span className="text-xs opacity-90 font-mono-tabular">
            {isEs ? 'Activo' : 'Active'}
          </span>
        </div>

        {/* Match Type & Format Bar */}
        <div className="bg-[#fafafa] p-3 sm:px-5 border-b border-[#e8e8ed] flex flex-wrap gap-2.5 items-center">
          <button
            onClick={() => {
              setMatchMode('singles');
              if (currentServer === 2 || currentServer === 4) setCurrentServer(1);
            }}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              matchMode === 'singles' ? 'bg-[#0071e3] text-white' : 'bg-[#e8e8ed] text-[#86868b]'
            }`}
          >
            {isEs ? 'Individuales' : 'Singles'}
          </button>
          <button
            onClick={() => setMatchMode('doubles')}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              matchMode === 'doubles' ? 'bg-[#0071e3] text-white' : 'bg-[#e8e8ed] text-[#86868b]'
            }`}
          >
            {isEs ? 'Dobles' : 'Doubles'}
          </button>

          <select
            value={matchFormat}
            onChange={(e) => {
              const fmt = e.target.value as typeof matchFormat;
              setMatchFormat(fmt);
              setIsTiebreak(fmt === 'tiebreak7' || fmt === 'tiebreak10');
            }}
            className="flex-[1.5] min-w-[180px] bg-[#e8e8ed] text-[#1d1d1f] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold outline-none cursor-pointer text-center"
          >
            <option value="standard">{isEs ? 'Set Estándar (6 Juegos)' : 'Standard Set (6 Games)'}</option>
            <option value="short">{isEs ? 'Set Corto (4 Juegos / Fast4)' : 'Short Set (4 Games / Fast4)'}</option>
            <option value="pro">{isEs ? 'Pro Set (8 Juegos)' : 'Pro Set (8 Games)'}</option>
            <option value="tiebreak7">{isEs ? 'Tiebreak a 7 Puntos' : '7-Point Tiebreak Match'}</option>
            <option value="tiebreak10">{isEs ? 'Super Tiebreak a 10 Puntos' : '10-Point Tiebreak Match'}</option>
          </select>
        </div>

        {/* No-Ad Scoring Setting */}
        {!isTiebreak && (
          <div className="px-5 py-3 border-b border-[#e8e8ed] flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1d1d1f]">
            <span>{isEs ? 'Punto de Oro (Sin Ventaja en Deuce)' : 'No-Ad Scoring (Sudden Death at Deuce)'}</span>
            <input
              type="checkbox"
              checked={ruleNoAd}
              onChange={(e) => setRuleNoAd(e.target.checked)}
              className="w-5 h-5 accent-[#0071e3] rounded cursor-pointer"
            />
          </div>
        )}

        {/* Editable Players & Sets/Games Row */}
        <div className="px-5 py-4 border-b border-[#e8e8ed] space-y-2.5 bg-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">
                1A
              </span>
              <input
                type="text"
                value={p1aName}
                onChange={(e) => setP1aName(e.target.value)}
                className="bg-transparent border-b border-dashed border-transparent focus:border-[#0071e3] text-sm sm:text-base font-semibold text-[#1d1d1f] outline-none w-full truncate"
              />
            </div>
            <strong className="text-xs sm:text-sm font-mono-tabular text-[#1d1d1f] shrink-0">
              {t1.sets} Sets ({t1.games} {isEs ? 'Juegos' : 'Games'})
            </strong>
          </div>

          {matchMode === 'doubles' && (
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">
                1B
              </span>
              <input
                type="text"
                value={p1bName}
                onChange={(e) => setP1bName(e.target.value)}
                className="bg-transparent border-b border-dashed border-transparent focus:border-[#0071e3] text-sm sm:text-base font-semibold text-[#1d1d1f] outline-none w-full truncate"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">
                2A
              </span>
              <input
                type="text"
                value={p2aName}
                onChange={(e) => setP2aName(e.target.value)}
                className="bg-transparent border-b border-dashed border-transparent focus:border-[#0071e3] text-sm sm:text-base font-semibold text-[#1d1d1f] outline-none w-full truncate"
              />
            </div>
            <strong className="text-xs sm:text-sm font-mono-tabular text-[#1d1d1f] shrink-0">
              {t2.sets} Sets ({t2.games} {isEs ? 'Juegos' : 'Games'})
            </strong>
          </div>

          {matchMode === 'doubles' && (
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">
                2B
              </span>
              <input
                type="text"
                value={p2bName}
                onChange={(e) => setP2bName(e.target.value)}
                className="bg-transparent border-b border-dashed border-transparent focus:border-[#0071e3] text-sm sm:text-base font-semibold text-[#1d1d1f] outline-none w-full truncate"
              />
            </div>
          )}
        </div>

        {/* Main 3-Column Scoreboard Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#e8e8ed]">
          {/* Left Side Panel: Active Server & Serve Logging */}
          <div className="md:col-span-4 p-5 border-b md:border-b-0 md:border-r border-[#e8e8ed] flex flex-col gap-3.5 order-2 md:order-1">
            <div>
              <div className="text-xs text-[#86868b] font-bold mb-2">
                {isEs ? 'Posición de Saque Activa' : 'Active Serving Position'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrentServer(1)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                    currentServer === 1
                      ? 'bg-[#ffcc00] text-[#1d1d1f] shadow-[0_0_6px_rgba(255,204,0,0.4)]'
                      : 'bg-[#e8e8ed] text-[#1d1d1f]'
                  }`}
                >
                  {getPlayerName(1)}
                </button>
                <button
                  onClick={() => setCurrentServer(3)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                    currentServer === 3
                      ? 'bg-[#ffcc00] text-[#1d1d1f] shadow-[0_0_6px_rgba(255,204,0,0.4)]'
                      : 'bg-[#e8e8ed] text-[#1d1d1f]'
                  }`}
                >
                  {getPlayerName(3)}
                </button>
                {matchMode === 'doubles' && (
                  <>
                    <button
                      onClick={() => setCurrentServer(2)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        currentServer === 2
                          ? 'bg-[#ffcc00] text-[#1d1d1f] shadow-[0_0_6px_rgba(255,204,0,0.4)]'
                          : 'bg-[#e8e8ed] text-[#1d1d1f]'
                      }`}
                    >
                      {getPlayerName(2)}
                    </button>
                    <button
                      onClick={() => setCurrentServer(4)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                        currentServer === 4
                          ? 'bg-[#ffcc00] text-[#1d1d1f] shadow-[0_0_6px_rgba(255,204,0,0.4)]'
                          : 'bg-[#e8e8ed] text-[#1d1d1f]'
                      }`}
                    >
                      {getPlayerName(4)}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveServeType('First')}
                className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  activeServeType === 'First' ? 'bg-[#1d1d1f] text-white' : 'bg-[#e8e8ed] text-[#86868b]'
                }`}
              >
                {isEs ? '1er Saque' : 'First Serve'}
              </button>
              <button
                onClick={() => setActiveServeType('Second')}
                className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  activeServeType === 'Second' ? 'bg-[#1d1d1f] text-white' : 'bg-[#e8e8ed] text-[#86868b]'
                }`}
              >
                {isEs ? '2do Saque' : 'Second Serve'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleFastServe('fault')}
                className="flex-1 py-3 px-2 rounded-xl bg-[#ff3b30] hover:opacity-90 text-white text-xs font-semibold cursor-pointer"
              >
                {isEs ? 'Falta de Saque' : 'Serve Fault'}
              </button>
              <button
                onClick={() => handleFastServe('ace')}
                className="flex-1 py-3 px-2 rounded-xl bg-[#34c759] hover:opacity-90 text-white text-xs font-semibold cursor-pointer"
              >
                {isEs ? 'Ace de Saque' : 'Serve Ace'}
              </button>
            </div>
          </div>

          {/* Center Main Score Display */}
          <div className="md:col-span-5 py-8 px-4 bg-[#fafafa] flex flex-col items-center justify-center order-1 md:order-2">
            <div className="text-[11px] text-[#86868b] font-semibold mb-3 text-center">
              {isComplex
                ? isEs
                  ? 'Toca el marcador para clasificar el punto'
                  : 'Tap score to log point & stroke metrics'
                : isEs
                ? 'Toca el marcador para sumar punto directo'
                : 'Tap score to award point directly'}
            </div>
            <div className="flex justify-around items-center w-full">
              <button
                onClick={() => handleScoreClick(1)}
                className="text-center flex-1 py-3 px-2 rounded-2xl hover:bg-black/4 transition-colors cursor-pointer"
              >
                <div className="text-sm sm:text-base text-[#86868b] font-semibold mb-1 truncate px-1">
                  {getTeamLabel(1)}
                </div>
                <div className="text-6xl sm:text-7xl font-extrabold leading-none text-[#1d1d1f] font-mono-tabular">
                  {formattedScores.p1}
                </div>
              </button>

              <div className="h-14 w-[1px] bg-[#e8e8ed]" />

              <button
                onClick={() => handleScoreClick(2)}
                className="text-center flex-1 py-3 px-2 rounded-2xl hover:bg-black/4 transition-colors cursor-pointer"
              >
                <div className="text-sm sm:text-base text-[#86868b] font-semibold mb-1 truncate px-1">
                  {getTeamLabel(2)}
                </div>
                <div className="text-6xl sm:text-7xl font-extrabold leading-none text-[#1d1d1f] font-mono-tabular">
                  {formattedScores.p2}
                </div>
              </button>
            </div>
          </div>

          {/* Right Side Panel: Rally Parameters */}
          <div className="md:col-span-3 p-5 border-t md:border-t-0 md:border-l border-[#e8e8ed] flex flex-col justify-between gap-3 order-3">
            <div className="text-xs text-[#86868b] font-bold">
              {isEs ? 'Parámetros de Peloteo' : 'Rally Parameters'}
            </div>
            <div
              onClick={() => setLiveRallyCount((c) => c + 1)}
              className="w-full bg-white border-2 border-[#0071e3] rounded-[14px] p-4 text-center cursor-pointer select-none hover:bg-[#0071e3]/4 transition-colors"
            >
              <div className="text-xs text-[#86868b] font-bold">
                {isEs ? 'Toques (Toca para sumar)' : 'Rally Count (Tap to Add)'}
              </div>
              <div className="text-4xl font-extrabold text-[#1d1d1f] mt-1 font-mono-tabular">
                {liveRallyCount}
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setLiveRallyCount((c) => Math.max(0, c - 1))}
                className="flex-1 py-1.5 rounded-lg bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs font-semibold text-[#1d1d1f] flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLiveRallyCount(0)}
                className="flex-1 py-1.5 rounded-lg bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs font-semibold text-[#86868b] cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => setLiveRallyCount((c) => c + 1)}
                className="flex-1 py-1.5 rounded-lg bg-[#f5f5f7] hover:bg-[#e8e8ed] text-xs font-semibold text-[#1d1d1f] flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics & Log Panel */}
        <div className="p-5 min-h-[210px] max-h-[340px] overflow-y-auto bg-white border-b border-[#e8e8ed]">
          {activeBottomTab === 'match-stats' && (
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#0071e3] mb-2.5">
                {isEs ? 'Estadísticas Generales' : 'General Statistics'}
              </div>
              <div className="divide-y divide-[#e8e8ed] text-sm font-mono-tabular">
                <div className="flex justify-between items-center py-2.5">
                  <span className="w-16 font-bold text-left text-[#1d1d1f]">{t1.totalWon}</span>
                  <span className="text-[#86868b] text-center flex-1 font-sans-ui font-medium">
                    {isEs ? 'Total de Puntos Ganados' : 'Total Points Won'}
                  </span>
                  <span className="w-16 font-bold text-right text-[#1d1d1f]">{t2.totalWon}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="w-16 font-bold text-left text-[#1d1d1f]">{t1WinPct}</span>
                  <span className="text-[#86868b] text-center flex-1 font-sans-ui font-medium">
                    {isEs ? '% de Puntos Ganados' : '% of Points Won'}
                  </span>
                  <span className="w-16 font-bold text-right text-[#1d1d1f]">{t2WinPct}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="w-16 font-bold text-left text-[#1d1d1f]">{t1ServePct}</span>
                  <span className="text-[#86868b] text-center flex-1 font-sans-ui font-medium">
                    {isEs ? '% 1er Saque Adentro' : '1st Serve In %'}
                  </span>
                  <span className="w-16 font-bold text-right text-[#1d1d1f]">{t2ServePct}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="w-16 font-bold text-left text-[#1d1d1f]">{t1.r1}</span>
                  <span className="text-[#86868b] text-center flex-1 font-sans-ui font-medium">
                    {isEs ? '0-4 Toques' : '0-4 Touches'}
                  </span>
                  <span className="w-16 font-bold text-right text-[#1d1d1f]">{t2.r1}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="w-16 font-bold text-left text-[#1d1d1f]">{t1.r2}</span>
                  <span className="text-[#86868b] text-center flex-1 font-sans-ui font-medium">
                    {isEs ? '5-8 Toques' : '5-8 Touches'}
                  </span>
                  <span className="w-16 font-bold text-right text-[#1d1d1f]">{t2.r2}</span>
                </div>
              </div>
            </div>
          )}

          {activeBottomTab === 'shot-stats' && (
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#0071e3] mb-2.5">
                {isEs ? 'Rendimiento de Métricas de Golpeo' : 'Shot Metric Performance'}
              </div>
              <div className="divide-y divide-[#e8e8ed] text-sm font-mono-tabular">
                <div className="flex justify-between items-center py-2.5">
                  <span className="w-16 font-bold text-left text-[#1d1d1f]">{t1.winners}</span>
                  <span className="text-[#86868b] text-center flex-1 font-sans-ui font-medium">Winners</span>
                  <span className="w-16 font-bold text-right text-[#1d1d1f]">{t2.winners}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="w-16 font-bold text-left text-[#1d1d1f]">{t1.unforced}</span>
                  <span className="text-[#86868b] text-center flex-1 font-sans-ui font-medium">
                    {isEs ? 'Errores No Forzados' : 'Unforced Errors'}
                  </span>
                  <span className="w-16 font-bold text-right text-[#1d1d1f]">{t2.unforced}</span>
                </div>
              </div>
            </div>
          )}

          {activeBottomTab === 'match-log' && (
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#0071e3] mb-2.5">
                {isEs ? 'Historial de Puntos' : 'Point Ledger Chronicle'}
              </div>
              <div className="divide-y divide-[#e8e8ed]">
                {pointHistory.length === 0 ? (
                  <p className="text-xs text-[#86868b] py-6 text-center">
                    {isEs ? 'Aún no hay puntos registrados.' : 'No points logged yet.'}
                  </p>
                ) : (
                  [...pointHistory].reverse().map((node, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-xs sm:text-sm text-[#1d1d1f]">
                      <span>{node.logText}</span>
                      {idx === 0 && (
                        <button
                          onClick={handleUndo}
                          className="bg-[#ff3b30] text-white text-xs px-2.5 py-1 rounded-md font-semibold cursor-pointer"
                        >
                          {isEs ? 'Deshacer' : 'Undo'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Utility Action Buttons Bar */}
        <div className="p-4 bg-white flex flex-wrap gap-2">
          <button
            onClick={handleUndo}
            disabled={pointHistory.length === 0}
            className="flex-1 min-w-[120px] py-3 px-3 rounded-xl bg-[#ff9500] text-white text-xs sm:text-sm font-semibold disabled:opacity-40 cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEs ? 'Deshacer Último Punto' : 'Undo Last Point'}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex-1 min-w-[140px] py-3 px-3 rounded-xl bg-[#0071e3] text-white text-xs sm:text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <BarChart2 className="w-4 h-4" />
            <span>{isEs ? 'Ver Reporte Resumen' : 'View Summary Report'}</span>
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex-1 min-w-[110px] py-3 px-3 rounded-xl bg-[#ff3b30] text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              {isEs ? 'Reiniciar Partido' : 'Reset Match'}
            </button>
          ) : (
            <div className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-[#fff1f2] border border-[#ff3b30]/30 rounded-xl px-3 py-2">
              <span className="text-xs font-bold text-[#ff3b30]">
                {isEs ? '¿Confirmar?' : 'Confirm?'}
              </span>
              <button
                onClick={handleResetConfirmed}
                className="p-1 bg-[#ff3b30] text-white rounded-md cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="p-1 bg-[#e8e8ed] text-[#1d1d1f] rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Tab Navigation */}
        <div className="bg-[#fafafa] border-t border-[#e8e8ed] py-3 flex justify-around">
          <button
            onClick={() => setActiveBottomTab('match-stats')}
            className={`flex-1 text-center text-xs font-semibold cursor-pointer ${
              activeBottomTab === 'match-stats' ? 'text-[#0071e3]' : 'text-[#86868b]'
            }`}
          >
            {isEs ? 'Estadísticas del Partido' : 'Match Stats'}
          </button>
          <button
            onClick={() => setActiveBottomTab('shot-stats')}
            className={`flex-1 text-center text-xs font-semibold cursor-pointer ${
              activeBottomTab === 'shot-stats' ? 'text-[#0071e3]' : 'text-[#86868b]'
            }`}
          >
            {isEs ? 'Estadísticas de Tiro' : 'Shot Stats'}
          </button>
          <button
            onClick={() => setActiveBottomTab('match-log')}
            className={`flex-1 text-center text-xs font-semibold cursor-pointer ${
              activeBottomTab === 'match-log' ? 'text-[#0071e3]' : 'text-[#86868b]'
            }`}
          >
            {isEs ? 'Registro del Partido' : 'Match Log'}
          </button>
        </div>

        {/* Complex Point Classification Overlay (When mode === 'complex') */}
        {isComplex && pointModalSide !== null && (
          <div className="absolute inset-0 bg-white z-50 p-6 flex flex-col overflow-y-auto">
            <div className="text-center text-lg font-bold text-[#0071e3] mb-4">
              {isEs ? `Punto ganado por: ${getTeamLabel(pointModalSide)}` : `Point won by: ${getTeamLabel(pointModalSide)}`}
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-center text-xs font-bold uppercase tracking-wide text-[#1d1d1f] mb-2.5">
                  {isEs ? '¿Cómo ganaron este punto?' : 'How did they win this point?'}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { val: 'Winner' as const, label: isEs ? 'Conectó un Winner' : 'Hit a Winner' },
                    { val: 'Unforced Error' as const, label: isEs ? 'Error No Forzado Rival' : 'Opponent Unforced Error' },
                    { val: 'Forced Error' as const, label: isEs ? 'Error Forzado Rival' : 'Forced Opponent Error' },
                    { val: 'Double Fault' as const, label: isEs ? 'Doble Falta Rival' : 'Opponent Double Fault' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setSelectedOutcome(item.val)}
                      className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                        selectedOutcome === item.val
                          ? 'bg-transparent border-2 border-[#0071e3] text-[#0071e3]'
                          : 'bg-[#0071e3] border-[#0071e3] text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedOutcome && selectedOutcome !== 'Double Fault' && (
                <>
                  {matchMode === 'doubles' && (
                    <div>
                      <div className="text-center text-xs font-bold uppercase tracking-wide text-[#1d1d1f] mb-2">
                        {selectedOutcome === 'Winner'
                          ? isEs ? '¿Qué jugador conectó el winner?' : 'Which player hit the winner?'
                          : isEs ? '¿Qué rival cometió el error?' : 'Which opponent made the error?'}
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {((selectedOutcome === 'Winner' ? pointModalSide : pointModalSide === 1 ? 2 : 1) === 1
                          ? ([1, 2] as const)
                          : ([3, 4] as const)
                        ).map((pNum) => (
                          <button
                            key={pNum}
                            onClick={() => setSelectedActor(pNum)}
                            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border cursor-pointer ${
                              selectedActor === pNum
                                ? 'bg-transparent border-2 border-[#0071e3] text-[#0071e3]'
                                : 'bg-[#0071e3] border-[#0071e3] text-white'
                            }`}
                          >
                            {getPlayerName(pNum)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-center text-xs font-bold uppercase tracking-wide text-[#1d1d1f] mb-2">
                      {isEs ? '¿De qué lado fue el golpe?' : 'On what side was the shot?'}
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { val: 'Forehand' as const, label: isEs ? 'Derecha (Forehand)' : 'Forehand' },
                        { val: 'Backhand' as const, label: isEs ? 'Revés (Backhand)' : 'Backhand' }
                      ].map((s) => (
                        <button
                          key={s.val}
                          onClick={() => setSelectedSide(s.val)}
                          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border cursor-pointer ${
                            selectedSide === s.val
                              ? 'bg-transparent border-2 border-[#0071e3] text-[#0071e3]'
                              : 'bg-[#0071e3] border-[#0071e3] text-white'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedSide && (
                    <div>
                      <div className="text-center text-xs font-bold uppercase tracking-wide text-[#1d1d1f] mb-2">
                        {isEs ? '¿Qué tipo de golpe?' : 'What type of stroke?'}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'Groundstroke', label: isEs ? 'Fondo' : 'Groundstroke' },
                          { val: 'Return', label: isEs ? 'Devolución' : 'Return' },
                          { val: 'Passing', label: 'Passing' },
                          { val: 'Approach', label: 'Approach' },
                          { val: 'Slice', label: 'Slice' },
                          { val: 'Volley', label: isEs ? 'Volea' : 'Volley' },
                          { val: 'Overhead', label: isEs ? 'Remate' : 'Overhead' }
                        ].map((st) => (
                          <button
                            key={st.val}
                            onClick={() => setSelectedStroke(st.val)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                              selectedStroke === st.val
                                ? 'bg-transparent border-2 border-[#0071e3] text-[#0071e3]'
                                : 'bg-[#0071e3] border-[#0071e3] text-white'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedStroke && (
                    <div>
                      <div className="text-center text-xs font-bold uppercase tracking-wide text-[#1d1d1f] mb-2">
                        {isEs ? '¿Dónde fue colocada la pelota?' : 'Where was the ball placed?'}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'Cross Court', label: isEs ? 'Cruzado' : 'Cross Court' },
                          { val: 'Middle Channel', label: isEs ? 'Al Centro' : 'Middle Channel' },
                          { val: 'Down the Line', label: isEs ? 'Paralelo' : 'Down the Line' }
                        ].map((loc) => (
                          <button
                            key={loc.val}
                            onClick={() => setSelectedLocation(loc.val)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                              selectedLocation === loc.val
                                ? 'bg-transparent border-2 border-[#0071e3] text-[#0071e3]'
                                : 'bg-[#0071e3] border-[#0071e3] text-white'
                            }`}
                          >
                            {loc.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedStroke && selectedOutcome !== 'Winner' && (
                    <div>
                      <div className="text-center text-xs font-bold uppercase tracking-wide text-[#1d1d1f] mb-2">
                        {isEs ? '¿Cómo falló el tiro?' : 'How did the error miss the court lines?'}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 'Long / Deep', label: isEs ? 'Larga' : 'Long / Deep' },
                          { val: 'In the Net', label: isEs ? 'En la Red' : 'In the Net' },
                          { val: 'Wide / Lateral', label: isEs ? 'Ancha' : 'Wide / Lateral' }
                        ].map((err) => (
                          <button
                            key={err.val}
                            onClick={() => setSelectedErrorDir(err.val)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                              selectedErrorDir === err.val
                                ? 'bg-transparent border-2 border-[#ff3b30] text-[#ff3b30]'
                                : 'bg-[#ff3b30] border-[#ff3b30] text-white'
                            }`}
                          >
                            {err.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-dashed border-[#e8e8ed]">
                <span className="font-semibold text-sm text-[#1d1d1f]">
                  {isEs ? 'Longitud del Peloteo:' : 'Rally Length:'}
                </span>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={liveRallyCount}
                  onChange={(e) => setLiveRallyCount(Number(e.target.value))}
                  className="flex-1 accent-[#0071e3]"
                />
                <span className="font-bold text-sm text-[#0071e3] min-w-[32px] text-right font-mono-tabular">
                  + {liveRallyCount}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-5 flex gap-3">
              <button
                onClick={() => setPointModalSide(null)}
                className="flex-1 py-3.5 rounded-xl bg-[#e8e8ed] text-[#1d1d1f] font-bold text-sm cursor-pointer"
              >
                {isEs ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={handleCommitModalPoint}
                disabled={!selectedOutcome}
                className="flex-1 py-3.5 rounded-xl bg-[#0071e3] text-white font-bold text-sm disabled:opacity-40 cursor-pointer"
              >
                {isEs ? 'Guardar Punto' : 'Save Point'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-[680px] w-full p-6 shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e8e8ed] pb-3">
              <div className="font-bold text-base sm:text-lg text-[#1d1d1f]">
                {isEs ? 'Reporte Visual de Rendimiento y Momentum' : 'Visual Performance & Momentum Report'}
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-[#86868b] hover:text-[#1d1d1f] text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#f5f5f7] p-3.5 rounded-[14px] border border-[#e8e8ed] text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[#86868b] font-semibold">{getTeamLabel(1)}:</span>
                <strong className="text-[#1d1d1f] font-mono-tabular">
                  {t1.sets} Sets / {t1.games} {isEs ? 'Juegos' : 'Games'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868b] font-semibold">{getTeamLabel(2)}:</span>
                <strong className="text-[#1d1d1f] font-mono-tabular">
                  {t2.sets} Sets / {t2.games} {isEs ? 'Juegos' : 'Games'}
                </strong>
              </div>
            </div>

            {/* Comparative Bars */}
            <div className="bg-[#fafafa] border border-[#e8e8ed] rounded-[16px] p-4 space-y-3">
              <div className="text-xs font-bold uppercase text-[#1d1d1f]">
                {isEs ? 'Comparación de Totales Acumulados' : 'Accumulated Stat Totals Comparison'}
              </div>
              {[
                { label: isEs ? 'Total de Puntos Ganados' : 'Total Points Won', v1: t1.totalWon, v2: t2.totalWon },
                { label: 'Winners', v1: t1.winners, v2: t2.winners },
                { label: isEs ? 'Errores No Forzados' : 'Unforced Errors', v1: t1.unforced, v2: t2.unforced },
                { label: isEs ? '0-4 Toques' : '0-4 Touches', v1: t1.r1, v2: t2.r1 },
                { label: isEs ? '5-8 Toques' : '5-8 Touches', v1: t1.r2, v2: t2.r2 },
                { label: isEs ? '9+ Toques' : '9+ Touches', v1: t1.r3, v2: t2.r3 }
              ].map((row, i) => {
                const maxVal = Math.max(row.v1, row.v2, 1);
                const w1 = Math.round((row.v1 / maxVal) * 100);
                const w2 = Math.round((row.v2 / maxVal) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="text-[11px] text-[#86868b] font-bold uppercase text-center">
                      {row.label}
                    </div>
                    <div className="grid grid-cols-[45px_1fr_1fr_45px] gap-3 items-center font-mono-tabular text-xs">
                      <span className="font-bold text-[#0071e3] text-left">{row.v1}</span>
                      <div className="bg-[#e8e8ed] h-2.5 rounded-full overflow-hidden flex justify-end">
                        <div className="bg-[#0071e3] h-full" style={{ width: `${w1}%` }} />
                      </div>
                      <div className="bg-[#e8e8ed] h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#ff3b30] h-full" style={{ width: `${w2}%` }} />
                      </div>
                      <span className="font-bold text-[#1d1d1f] text-right">{row.v2}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Momentum Graph */}
            <div className="bg-[#fafafa] border border-[#e8e8ed] rounded-[16px] p-4">
              <div className="text-xs font-bold uppercase text-[#1d1d1f] mb-1">
                {isEs ? 'Gráfico de Flujo de Momentum del Partido' : 'Match Momentum Flow Chart'}
              </div>
              <div className="text-[11px] text-[#86868b] font-semibold mb-2.5">
                {isEs
                  ? 'La línea central indica empate. Hacia arriba favorece al Jugador 1 | Hacia abajo favorece al Jugador 2.'
                  : 'Baseline indicates center tie. Upward tracking favors Side 1 | Downward tracking favors Side 2.'}
              </div>
              <div className="bg-white border border-[#e8e8ed] rounded-xl p-2 overflow-hidden">
                <canvas
                  ref={modalCanvasRef}
                  width={600}
                  height={220}
                  className="w-full h-auto block"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {isEs ? 'Cerrar Vista Previa' : 'Close Preview'}
              </button>
              <button
                onClick={downloadHTMLReport}
                className="flex-1 py-3 rounded-xl bg-[#0071e3] text-white text-xs sm:text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{isEs ? 'Descargar Reporte (.HTML)' : 'Download Visual Report (.HTML)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
