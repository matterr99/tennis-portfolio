import React from 'react';
import { ArticleData, Language, UI_TEXT } from '../data/articlesData';
import { ArrowLeft } from 'lucide-react';

interface ArticleReaderProps {
  article: ArticleData;
  lang: Language;
  onBack: () => void;
  onSelectArticle: (id: string) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  lang,
  onBack,
  onSelectArticle
}) => {
  const t = UI_TEXT[lang];
  const isEs = lang === 'es';

  return (
    <div className="w-full max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-white rounded-[28px] border border-[#e8e8ed] shadow-[0_20px_40px_rgba(0,0,0,0.04)] p-6 sm:p-10 md:p-12">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[#0071e3] hover:underline font-medium text-sm sm:text-base mb-8 transition-transform hover:-translate-x-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEs ? 'Volver al Blog' : 'Back to Blog'}</span>
        </button>

        {/* Article Header */}
        <header className="mb-8 sm:mb-10">
          <div className="text-[#86868b] text-sm sm:text-[0.95rem] mb-2 font-medium">
            {article.authorLine[lang]}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-bold tracking-tight text-[#1d1d1f] leading-[1.18] text-balance">
            {article.title[lang]}
          </h1>
        </header>

        {/* Article Content */}
        <section className="space-y-6 text-[1.05rem] sm:text-[1.12rem] leading-[1.8] text-[#1d1d1f]">
          {/* 1. SPLIT STEP MISCONCEPTION */}
          {article.id === 'split-step-misconception' && (
            <>
              <p>
                {isEs
                  ? 'Durante décadas, los entrenadores de tenis han confiado en un ancla rítmica de oro para enseñar el seguimiento visual y la sincronización: el ejercicio "Bote-Golpe" (Bounce-Hit). Popularizado a finales del siglo XX y pilar de la enseñanza a principios de los años 2000, el ejercicio es hermosamente simple: dices "Bote" cuando la pelota aterriza en tu lado y "Golpe" cuando haces contacto.'
                  : 'For decades, tennis coaches have relied on a golden rhythmic anchor to teach tracking and timing: the "Bounce-Hit" drill. Popularized in the late 20th century and a staple of early 2000s tennis, the drill is beautifully simple. You call out "Bounce" when the ball lands on your side, and "Hit" when you make contact.'}
              </p>
              <p>
                {isEs
                  ? 'Crea una cadencia limpia e hipnótica. Calma la mente y pone los pies en movimiento. Pero a medida que las velocidades de pelota desde la línea de fondo se han disparado, la ciencia del deporte ha revelado una dura verdad: tratar el juego como un metrónomo constante podría estar frenando tu juego de pies.'
                  : 'It creates a clean, hypnotic cadence. It calms the mind and gets the feet moving. But as baseline ball speeds have skyrocketed, sport science has revealed a hard truth: treating the game like a steady metronome might actually be holding your footwork back.'}
              </p>
              <p>
                {isEs
                  ? 'Para entender por qué, tenemos que mirar al otro lado de la red en el momento exacto en que ocurre el "Golpe".'
                  : 'To understand why, we have to look across the net at the exact moment when "Hit" occurs.'}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? 'La Ilusión del "Golpe" Neutral' : 'The Illusion of the Neutral "Hit"'}
              </h2>
              <p>
                {isEs
                  ? 'En la aplicación tradicional del ejercicio, la palabra "Golpe" al otro lado de la red sirve como un disparo de salida universal. Los manuales clásicos de entrenamiento enseñaban que cuando el oponente golpea la pelota, el jugador que recibe debe ejecutar un split-step perfectamente sincronizado y simétrico: aterrizando plano sobre ambos pies, completamente neutral, listo para reaccionar a la izquierda o a la derecha.'
                  : 'In the traditional application of the drill, the word "Hit" across the net serves as a universal starting gun. Classic coaching manuals taught that as the opponent strikes the ball, the receiving player should execute a perfectly timed, symmetrical split step—landing flat on both feet, completely neutral, ready to react left or right.'}
              </p>
              <p>
                {isEs
                  ? 'Este enfoque asume un lujo que el tenis moderno rara vez permite: tiempo.'
                  : 'This approach assumes a luxury that modern tennis rarely affords: time.'}
              </p>
              <p>
                {isEs
                  ? 'Cuando los jugadores intercambian golpes de fondo pesados y cargados de topspin a velocidades de élite, esperar a que la pelota sea golpeada antes de iniciar un aterrizaje neutral te deja en una desventaja estructural masiva. Si aterrizas perfectamente plano después de que se golpea la pelota, ya llegas demasiado tarde.'
                  : 'When players are trading heavy, topspin-laden groundstrokes at elite speeds, waiting for the ball to be struck before initiating a neutral landing leaves you at a massive structural disadvantage. If you land perfectly flat-footed after the ball is hit, you are already too late.'}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? 'La Realidad en el Aire del Juego de Pies Moderno' : 'The Mid-Air Reality of Modern Footwork'}
              </h2>
              <p>
                {isEs
                  ? 'Aquí es donde el ritmo tradicional choca con la biomecánica moderna. Según el manual de Entrenador de Rendimiento de Tenis (TPT) de la ITPA, la comprensión clásica del split-step queda expuesta como un concepto erróneo generalizado. El análisis de video de alta velocidad de jugadores de élite revela que el split-step no es un reinicio pasivo y neutral; es una secuencia de lanzamiento activa y predictiva.'
                  : 'This is where traditional rhythm clashes with modern biomechanics. According to the ITPA Tennis Performance Trainer (TPT) manual, the classic understanding of the split step is exposed as a widespread misconception. High-speed video analysis of elite players reveals that the split step is not a passive, neutral reset; it is an active, predictive launch sequence.'}
              </p>
              <p>
                {isEs
                  ? 'El manual TPT de la ITPA destaca que los atletas de élite no esperan a aterrizar planos en la cancha antes de decidir hacia dónde moverse. En cambio, reaccionan activamente en el aire durante la fase del split-step.'
                  : 'The ITPA TPT manual highlights that elite athletes do not wait to land flat on the court before deciding where to move. Instead, they actively react in the air during the split step phase.'}
              </p>
              <p>
                {isEs
                  ? 'Antes de que sus pies toquen el suelo, un jugador moderno ya ha leído la trayectoria de la pelota entrante. Si un jugador diestro se da cuenta de que necesita moverse hacia su lado de derecha:'
                  : 'Before their feet even touch the ground, a modern player has already read the trajectory of the incoming ball. If a right-handed player realizes they need to move to their forehand side:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Rota sutilmente su cadera externamente mientras aún está en el aire.'
                    : 'They subtly rotate their hip externally while still airborne.'}
                </li>
                <li>
                  {isEs
                    ? 'Aterriza de forma asimétrica, plantando el pie más alejado de su objetivo previsto una fracción de segundo antes que el otro pie (en este caso, cargando primero la pierna izquierda para explotar hacia la derecha).'
                    : 'They land asymmetrically, planting the foot furthest from their intended target a split-second ahead of the other foot (in this case, loading the left leg first to explode to the right).'}
                </li>
                <li>
                  {isEs
                    ? 'Su pie derecho aterriza apuntando hacia afuera, cargando instantáneamente los músculos de la pierna como un resorte comprimido para explotar hacia la pelota.'
                    : 'Their right foot lands pointing outwards, instantly loading the leg muscles like a coiled spring to explode toward the ball.'}
                </li>
              </ul>

              {/* Original Flow Container Diagram */}
              <div className="bg-[#f5f5f7] p-5 rounded-xl font-mono-tabular text-xs sm:text-sm leading-relaxed my-7 overflow-x-auto text-[#424245] border border-[#e5e5e7]">
                <div className="whitespace-pre-wrap">
                  {isEs
                    ? `Ritmo Clásico: [Oponente Golpea] ➔ [Aterrizas Neutral] ➔ [Lees Dirección] ➔ [Te Mueves]\nRitmo Moderno: [Oponente Prepara] ➔ [Estás en el Aire] ➔ [Lees y Rotas en el Aire] ➔ [Aterrizaje Asimétrico]`
                    : `Classic Rhythm: [Opponent Hits] ➔ [You Land Neutrally] ➔ [You Read Direction] ➔ [You Move]\nModern Rhythm:  [Opponent Prepares] ➔ [You Airborne] ➔ [You Read & Rotate Mid-Air] ➔ [Asymmetric Landing]`}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? 'La Prueba Biomecánica: El Ciclo de Estiramiento-Acortamiento' : 'The Biomechanical Proof: The Stretch-Shortening Cycle'}
              </h2>
              <p>
                {isEs
                  ? 'Para respaldar los datos observacionales de las guías de la ITPA, los científicos del deporte han analizado profundamente las variables neuromusculares de este movimiento exacto. Un estudio fundamental de Nieminen et al. (European Journal of Sports Science) evaluó las ventajas cinéticas del split-step.'
                  : 'To back up the observational data found in the ITPA guidelines, sports scientists have looked deeply into the neuromuscular variables of this exact movement. A landmark study by Nieminen et al. (European Journal of Sports Science) evaluated the kinetic advantages of the split step.'}
              </p>
              <p>
                {isEs
                  ? 'Los investigadores descubrieron que un split-step correctamente sincronizado provoca un pico masivo en las Fuerzas de Reacción del Suelo (GRF) y depende en gran medida del Ciclo de Estiramiento-Acortamiento (SSC). El estudio destacó que los jugadores de élite muestran una "pre-activación" sustancial de los músculos de la pierna y el tobillo antes de tocar el suelo.'
                  : 'The researchers discovered that a properly timed split step triggers a massive spike in Ground Reaction Forces (GRF) and relies heavily on the Stretch-Shortening Cycle (SSC). The study highlighted that elite players exhibit substantial "pre-activation" of the leg and ankle muscles before they ever hit the ground.'}
              </p>
              <p>
                {isEs
                  ? 'Al leer la pelota en el aire y pre-activar los músculos, el atleta regula la rigidez de la pierna en el descenso. Cuando ese primer pie asimétrico golpea la cancha, la energía elástica potencial no se absorbe ni se pierde; actúa como un resorte impulsado, proyectando instantáneamente al jugador hacia la pelota. Si utilizas una cadencia estricta de la vieja escuela de "Bote-Golpe", pierdes por completo esta ventana en el aire de pre-activación muscular.'
                  : "By reading the ball mid-air and pre-activating the muscles, the athlete regulates leg stiffness on descent. When that first asymmetrical foot strikes the court, the potential elastic energy isn't absorbed or lost; it acts like a jolted spring, instantly rocketing the player toward the ball. If you use a strict, old-school \"Bounce-Hit\" cadence, you completely miss this mid-air window of muscle pre-activation."}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? 'Integrando el Ritmo Clásico con la Explosividad Moderna' : 'Integrating Old-School Rhythm with New-School Explosiveness'}
              </h2>
              <p>
                {isEs
                  ? '¿Significa esto que el ejercicio "Bote-Golpe" está obsoleto? No del todo.'
                  : 'Does this mean the "Bounce-Hit" drill is obsolete? Not entirely.'}
              </p>
              <p>
                {isEs
                  ? 'El ejercicio sigue siendo una herramienta excepcional para jugadores principiantes e intermedios que luchan con el seguimiento visual básico, la ansiedad en la cancha o los pies estáticos. Construye las vías neuronales fundamentales necesarias para conectar los ojos con el tiempo de golpeo.'
                  : 'The drill remains an exceptional tool for beginners and intermediate players who struggle with basic tracking, anxiety on court, or lazy feet. It builds the foundational neural pathways required to connect your eyes to your timing.'}
              </p>
              <p>
                {isEs
                  ? 'Sin embargo, para sobrevivir al juego moderno, el ejercicio necesita una actualización conceptual. Los entrenadores y jugadores deben dejar de ver el primer "Golpe" al otro lado de la red como un punto de aterrizaje estático y equilibrado. En su lugar, ese momento debe tratarse como el punto máximo de tu lectura en el aire: la fracción de segundo exacta en que tus caderas rotan para dominar el caos antes de que tus pies toquen el suelo.'
                  : 'However, to survive the modern game, the drill needs a conceptual upgrade. Coaches and players must stop viewing the first "Hit" across the net as a static, balanced landing point. Instead, that moment should be treated as the peak of your airborne read—the exact split-second your hips rotate to conquer chaos before your feet ever touch the ground.'}
              </p>

              <div className="bg-[#0071e3]/6 p-6 rounded-2xl text-center font-semibold text-base sm:text-lg mt-10 border border-[#0071e3]/15 text-[#1d1d1f]">
                {isEs
                  ? 'El primer "Golpe" es una señal para aterrizar y también es tu ventana para rotar, cargar y conquistar el caos antes de pisar la cancha.'
                  : 'The first "Hit" is a cue to land and it is also your window to rotate, load, and conquer chaos before hitting the court.'}
              </div>
            </>
          )}

          {/* 2. SLOWER TENNIS BALLS */}
          {article.id === 'slower-tennis-balls' && (
            <>
              <p>
                {isEs
                  ? 'Camina por casi cualquier instalación de tenis en el mundo y encontrarás pelotas de baja compresión —Rojas, Naranjas y de Punto Verde— cuidadosamente apiladas en los cestos de los programas juveniles. Debido a esto, se ha cristalizado un desafortunado estigma psicológico: los jugadores adultos a menudo miran una pelota modificada y piensan: "Esos son juguetes para niños pequeños... Necesito entrenar con pelotas amarillas estándar reales".'
                  : 'Walk onto almost any tennis facility worldwide, and you will find low-compression tennis balls—Red, Orange, and Green Dot—neatly stacked in youth program bins. Because of this, an unfortunate psychological stigma has crystallized: adult players often look at a modified ball and think, "Those are toys for toddlers... I need to be training with real, standard yellow balls."'}
              </p>
              <p>
                {isEs
                  ? 'Este es uno de los conceptos erróneos más dañinos en el desarrollo del tenis moderno. Las pelotas de tenis de menor compresión no son una métrica de edad; son instrumentos de escalado biomecánico altamente especializados.'
                  : 'This is one of the single most damaging misconceptions in modern tennis development. Lower-compression tennis balls are not an age metric; they are highly specialized biomechanical scaling instruments.'}
              </p>
              <p>
                {isEs
                  ? 'Ya sea que un atleta tenga 12, 35 o 60 años, si está luchando por dominar la mecánica desde el fondo o por optimizar la conciencia espacial táctica, reducir la compresión de la pelota puede transformar fundamentalmente su ritmo de mejora. Analicemos la ciencia del deporte detrás de por qué las pelotas más lentas construyen mejores jugadores.'
                  : "Whether an athlete is 12, 35, or 60 years old, if they are fighting to master baseline mechanics or optimize tactical spatial awareness, dropping the ball compression can fundamentally transform their rate of improvement. Let's dissect the sports science behind why slower balls build superior players."}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '1. Superando la Penalización Biomecánica de las Pelotas Amarillas'
                  : '1. Overcoming the Biomechanical Penalty of Yellow Balls'}
              </h2>
              <p>
                {isEs
                  ? 'Cuando un jugador adulto principiante o intermedio se ve obligado a entrenar exclusivamente con pelotas amarillas estándar, sufre una enorme penalización biomecánica. Las pelotas de tenis estándar viajan a velocidades rápidas y rebotan alto fuera de la zona de golpeo natural de un principiante. Esto obliga al sistema nervioso central a entrar en un estado continuo de supervivencia, provocando errores mecánicos críticos:'
                  : "When an introductory or intermediate adult player is forced to train exclusively with standard yellow balls, they are hit with a massive biomechanical penalty. Standard tennis balls travel at rapid velocities and bounce high out of a beginner's natural strike zone. This forces the central nervous system into a continuous state of survival, causing critical mechanical errors:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>{isEs ? 'Trayectorias de Swing Abreviadas:' : 'Abbreviated Swing Paths:'}</strong>{' '}
                  {isEs
                    ? 'Los jugadores acortan su terminación y frenan sus movimientos por miedo a tirar la pelota larga.'
                    : 'Players shorten their follow-through and jerk their motions out of fear of hitting long.'}
                </li>
                <li>
                  <strong>{isEs ? 'Puntos de Contacto Tardíos:' : 'Late Contact Points:'}</strong>{' '}
                  {isEs
                    ? 'La pelota impacta la raqueta detrás de las caderas, rompiendo por completo la cadena cinética.'
                    : 'The ball catches the racket behind the hips, completely breaking the kinetic chain.'}
                </li>
                <li>
                  <strong>{isEs ? 'Juego de Pies Estático:' : 'Static Footwork:'}</strong>{' '}
                  {isEs
                    ? 'El pánico ante la velocidad entrante hace que los pies se congelen, obligando a los jugadores a estirarse fuera de equilibrio.'
                    : 'The sheer panic of incoming velocity causes the feet to freeze, causing players to reach off-balance.'}
                </li>
              </ul>
              <p>
                {isEs
                  ? 'Al reducir la velocidad y regular la altura del bote, las pelotas de menor compresión otorgan a los jugadores la ventana de tiempo crítica necesaria para prepararse limpiamente, establecer una base sólida en el tren inferior y ejecutar un swing cinético completo y relajado.'
                  : 'By slowing down the velocity and regulating the bounce height, lower-compression balls grant players the critical time window needed to set up cleanly, establish a loaded lower-body foundation, and execute a relaxed, full kinetic swing.'}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '2. Ampliando el Ancho de Banda Cognitivo para la Lectura Táctica'
                  : '2. Expanding Cognitive Bandwidth for Tactical Literacy'}
              </h2>
              <p>
                {isEs
                  ? 'El tenis no es un deporte de golpeo; es un deporte de toma de decisiones espaciales a alta velocidad. Sin embargo, la verdadera ejecución táctica requiere ancho de banda cognitivo. Si el 100% del enfoque mental de un jugador se agota simplemente intentando coordinar el contacto ojo-mano con una pelota amarilla de alta velocidad, sufre de ceguera táctica.'
                  : "Tennis is not a hitting sport; it is a rapid-fire spatial decision-making sport. However, true tactical execution requires cognitive bandwidth. If 100% of a player's mental focus is drained simply trying to coordinate hand-eye contact with a high-velocity yellow ball, they suffer from tactical blindness."}
              </p>
              <p>
                {isEs
                  ? 'Las pelotas de menor compresión desaceleran el juego, alejando el enfoque cognitivo de la supervivencia básica y abriendo espacio mental para la geometría avanzada de la cancha:'
                  : 'Lower-compression balls decelerate the game, shifting the cognitive focus away from basic survival and opening up mental space for advanced court geometry:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Reconocer proactivamente la posición en cancha del oponente antes de seleccionar el destino del golpe.'
                    : 'Proactively recognizing the opponent’s court position before selecting a shot destination.'}
                </li>
                <li>
                  {isEs
                    ? 'Elegir deliberadamente cuándo jugar una pelota cruzada defensiva de alto margen frente a un tiro agresivo paralelo.'
                    : 'Deliberately choosing when to play a high-margin defensive crosscourt ball versus an aggressive line shot.'}
                </li>
                <li>
                  {isEs
                    ? 'Desarrollar orientación espacial para reconocer pelotas cortas temprano y avanzar hacia la red.'
                    : 'Developing spatial orientation to recognize short balls early and move toward the net.'}
                </li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '3. La Matemática de la Maestría: Densidad de Volumen de Contacto'
                  : '3. The Math of Mastery: Density of Touch Volume'}
              </h2>
              <p>
                {isEs
                  ? 'La automaticidad neuromuscular está impulsada enteramente por la repetición limpia y de alto volumen. Con pelotas amarillas estándar, los peloteos de adultos principiantes rara vez duran más de 1 o 2 tiros caóticos antes de que ocurra un error. Esto resulta en sesiones de práctica fragmentadas y frustrantes con muy pocas horas de contacto significativo.'
                  : 'Neuromuscular automaticity is driven entirely by high-volume, clean repetition. With standard yellow balls, introductory adult rallies rarely last beyond 1 or 2 chaotic shots before an error occurs. This results in highly fractured, frustrating practice sessions with very few meaningful contact hours.'}
              </p>
              <p>
                {isEs
                  ? 'Cambiar a una pelota escalada transforma por completo la matemática del desarrollo. La menor compresión permite que los peloteos se extiendan consistentemente más allá de 6, 8 o 10 tiros. Los beneficios inmediatos incluyen:'
                  : 'Switching to a scaled ball completely flips the developmental math. Lower compression allows rallies to consistently extend past 6, 8, or 10 shots. The immediate developmental dividends include:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Mayor densidad de contacto por hora de entrenamiento, acelerando la memoria muscular.'
                    : 'Significantly higher contact density per training hour, accelerating muscle memory.'}
                </li>
                <li>
                  {isEs
                    ? 'Mejor acondicionamiento anaeróbico a través de movimientos dinámicos y sostenidos en el peloteo.'
                    : 'Improved anaerobic conditioning through sustained, dynamic rally movement.'}
                </li>
                <li>
                  {isEs
                    ? 'Una reducción masiva de la ansiedad por el rendimiento, reemplazando la frustración con fluidez estructural.'
                    : 'A massive reduction in performance anxiety, replacing frustration with structural flow.'}
                </li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '4. Utilidad de Alto Rendimiento: Por Qué los Jugadores de Élite Bajan la Compresión'
                  : '4. High-Performance Utility: Why Elite Players Drop Compression'}
              </h2>
              <p>
                {isEs
                  ? 'Ver las pelotas escaladas estrictamente como "equipo para principiantes" ignora cómo las utilizan los profesionales del circuito. Los mejores entrenadores introducen frecuentemente pelotas de baja compresión a jugadores avanzados y competitivos para eliminar variables de velocidad al afinar componentes delicados de su juego:'
                  : 'To view scaled balls as strictly "beginner equipment" ignores how elite touring professionals utilize them. Top coaches frequently introduce low-compression balls to advanced and competitive players to strip away velocity variables when fine-tuning delicate components of their game:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Aislar ajustes técnicos complejos, como rediseñar el retraso estructural de la muñeca (wrist lag) o el patrón de preparación de la derecha.'
                    : "Isolating complex technical adjustments, such as reworking a player's structural wrist lag or forehand takeback pattern."}
                </li>
                <li>
                  {isEs
                    ? 'Patrones de alta intensidad enfocados en ángulos de recuperación defensiva de juego de pies, donde la consistencia de seguimiento es primordial.'
                    : 'High-intensity patterns focused on defensive footwork recovery angles, where tracking consistency is paramount.'}
                </li>
                <li>
                  {isEs
                    ? 'Desarrollar aceleración pura en la cabeza de la raqueta golpeando a máxima potencia sin preocuparse de que la pelota vuele más allá de la línea de fondo.'
                    : 'Developing raw racket-head acceleration by swinging at maximum force without worrying about the ball sailing past the baseline.'}
                </li>
              </ul>

              <div className="bg-[#f5f5f7] p-7 rounded-2xl my-9 border-l-4 border-[#1d1d1f]">
                <h3 className="text-lg font-semibold text-[#1d1d1f] mt-0 mb-2">
                  {isEs ? 'La Regla del Escalado de Equipamiento' : 'The Equipment Scaling Rule'}
                </h3>
                <p className="m-0 text-base text-[#1d1d1f]">
                  {isEs
                    ? 'En el golf, no empiezas con un driver en cada golpe; escalas tus palos. En el tenis, escalas tu pelota. La pelota es tu maestro principal. Si la pelota se mueve demasiado rápido para que tu mecánica se adapte, no estás entrenando: simplemente estás adivinando.'
                    : "In golf, you don't start with a driver on every single shot; you scale your clubs. In tennis, you scale your ball. The ball is your primary teacher. If the ball is moving too fast for your mechanics to adapt, you aren't training—you are simply guessing."}
                </p>
              </div>

              <div className="bg-[#0071e3]/6 p-6 rounded-2xl text-center font-semibold text-base sm:text-lg mt-10 border border-[#0071e3]/15 text-[#1d1d1f]">
                {isEs
                  ? 'El objetivo es construir estrategas pensantes con una mecánica impecable, no golpeadores en pánico tratando de sobrevivir a la velocidad.'
                  : 'The objective is to build thinking tacticians with flawless mechanics, not panicking hitters trying to survive the speed.'}
              </div>
            </>
          )}

          {/* 3. FASTER TENNIS BALLS */}
          {article.id === 'faster-tennis-balls' && (
            <>
              <p>
                {isEs
                  ? 'Uno de los errores más persistentes en el desarrollo moderno de jugadores es apresurar a los atletas a través de la vía de compresión de pelotas basándose únicamente en la edad cronológica. Padres y jugadores a menudo ven la transición de pelotas Rojas a Naranjas, Punto Verde y finalmente Amarillas estándar como una carrera contra el calendario.'
                  : 'One of the most persistent flaws in modern player development is rushing athletes through the ball-compression pathway based entirely on chronological age. Parents and players often view transitioning from Red to Orange, Green Dot, and finally Yellow standard balls as a race against the calendar.'}
              </p>
              <p>
                {isEs
                  ? 'Sin embargo, la ciencia del deporte de élite cuenta una historia muy diferente. Organismos rectores como la Federación Internacional de Tenis (ITF), la USTA y el Professional Tennis Registry (PTR) enfatizan que la progresión debe basarse estrictamente en el rendimiento. Pasar a un jugador a una pelota de mayor velocidad antes de que posea la mecánica técnica para manejarla estancará inmediatamente su desarrollo, cimentando malos hábitos que se vuelven increíblemente difíciles de corregir más adelante.'
                  : 'However, elite sports science tells a vastly different story. Governing bodies like the International Tennis Federation (ITF), USTA, and the Professional Tennis Registry (PTR) emphasize that progression must be strictly performance-based. Moving a player to a higher-velocity ball before they possess the technical mechanics to handle it will immediately stagnate their development, cementing bad habits that become incredibly difficult to break later on.'}
              </p>
              <p>
                {isEs
                  ? 'Para asegurar que un jugador esté verdaderamente equipado estructural y mentalmente para una pelota más rápida, los entrenadores deben buscar cuatro indicadores biomecánicos y tácticos definitivos:'
                  : 'To ensure a player is truly structurally and mentally equipped for a faster ball, coaches must look for four definitive biomechanical and tactical indicators:'}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '1. Sostenibilidad Técnica en Peloteos Extendidos'
                  : '1. Technical Sustainability in Extended Rallies'}
              </h2>
              <p>
                {isEs
                  ? 'La verdadera preparación se define por la consistencia de la mecánica de golpeo de un jugador bajo presión. Un atleta solo está listo para graduarse a una mayor compresión de pelota cuando puede ejecutar sin esfuerzo peloteos extendidos sin colapso técnico. Las métricas clave incluyen:'
                  : "True readiness is defined by the consistency of a player's stroke mechanics under pressure. An athlete is only ready to graduate to a higher ball compression when they can effortlessly execute extended rallies without technical breakdown. Key metrics include:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Sostener consistentemente peloteos controlados de 5 a 10 pelotas profundas en la cancha.'
                    : 'Consistently sustaining controlled 5–10 ball rallies deep into the court.'}
                </li>
                <li>
                  {isEs
                    ? 'Mantener una preparación, punto de impacto y extensión repetibles en cada tiro.'
                    : 'Maintaining a repeatable backswing, strike point, and extension on every shot.'}
                </li>
                <li>
                  {isEs
                    ? 'Dictar la profundidad y altura de la pelota con topspin o slice intencional.'
                    : 'Dictating the depth and height of the ball with intentional topspin or slice.'}
                </li>
              </ul>
              <p>
                {isEs
                  ? 'Si los patrones de golpeo de un jugador comienzan a colapsar, fracturarse o acortarse después de solo tres o cuatro tiros, la velocidad base de la pelota ya es demasiado rápida para que su sistema nervioso actual la gestione.'
                  : "If a player's stroke patterns begin to collapse, fracture, or shorten after just three or four shots, the baseline ball velocity is already too fast for their current nervous system to manage."}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '2. Equilibrio Dinámico y Recuperación del Centro de Masa'
                  : '2. Dynamic Balance and Center of Mass Recovery'}
              </h2>
              <p>
                {isEs
                  ? 'Una pelota de tenis más rápida exige velocidades de procesamiento significativamente aceleradas y un juego de pies explosivo. Un jugador no está preparado para una pelota más rápida si constantemente golpea estirado, apoyado en el pie trasero o cayéndose hacia los lados. Los jugadores listos muestran signos claros de eficiencia cinética:'
                  : 'A faster tennis ball demands significantly accelerated processing speeds and explosive footwork. A player is unequipped for a faster ball if they are constantly striking it on the stretch, off their back foot, or while falling over sideways. Ready players display clear signs of kinetic efficiency:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Correr hacia el bote temprano para establecer una base estable y cargada antes de iniciar el swing.'
                    : 'Sprinting to the bounce early to establish a stable, loaded foundation before initiating the swing.'}
                </li>
                <li>
                  {isEs
                    ? 'Mantener una posición de cabeza estable y un centro de masa controlado durante toda la fase rotacional del impacto.'
                    : 'Maintaining a stable head position and controlled center of mass through the entire rotational phase of the strike.'}
                </li>
                <li>
                  {isEs
                    ? 'Ejecutar pasos de recuperación inmediatos y eficientes (como un split-step o paso cruzado) para reiniciarse ante el siguiente tiro.'
                    : 'Executing immediate, efficient recovery steps (such as a split step or crossover) to reset for the incoming shot.'}
                </li>
              </ul>
              <p>
                {isEs
                  ? 'Cuando un atleta luce perpetuamente apresurado, se lanza sin control o golpea con alta tensión muscular, significa que su sistema de seguimiento no puede mantener el ritmo de la velocidad actual de la pelota.'
                  : 'When an athlete looks perpetually rushed, lunges wildly, or hits with high muscle tension, it means their tracking system cannot keep pace with the current ball velocity.'}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '3. Cambio Cognitivo de Reacción a Estrategia Intencional'
                  : '3. Cognitive Shift from Reactionary to Intentional Strategy'}
              </h2>
              <p>
                {isEs
                  ? 'Cuando una pelota se mueve demasiado rápido para el nivel de habilidad de un jugador, el 100% de su ancho de banda cognitivo se consume simplemente tratando de hacer contacto con las cuerdas. La táctica desaparece. La verdadera preparación se manifiesta cuando el golpeo se vuelve automático, liberando espacio mental para la resolución de problemas en tiempo real:'
                  : "When a ball moves too fast for a player's skill level, 100% of their cognitive bandwidth is consumed merely trying to make contact with the strings. Tactics vanish. True readiness manifests when striking becomes automatic, freeing up mental space for real-time problem solving:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Apuntar intencionalmente a espacios abiertos en la cancha en lugar de devolver al centro.'
                    : 'Intentionally targeting open spaces on the court rather than hitting back to the center.'}
                </li>
                <li>
                  {isEs
                    ? 'Construir patrones básicos, como golpear pelotas cruzadas consecutivas para abrir la cancha.'
                    : 'Constructing basic patterns, such as hitting consecutive crosscourt balls to build an opening.'}
                </li>
                <li>
                  {isEs
                    ? 'Leer proactivamente la pelota corta para hacer la transición hacia adelante a la red.'
                    : 'Proactively reading the short ball to transition forward to the net.'}
                </li>
              </ul>
              <p>
                {isEs
                  ? 'Si la colocación de los tiros de un atleta parece completamente aleatoria o en pánico, aún se requieren pelotas de menor compresión para mantener manejable su carga cognitiva.'
                  : "If an athlete's shot placement looks completely random or panicked, lower-compression balls are still required to keep their cognitive load manageable."}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '4. Fluidez Cinestésica y Ausencia de Respuestas de Estrés'
                  : '4. Kinesthetic Fluency and Absence of Stress Responses'}
              </h2>
              <p>
                {isEs
                  ? 'La eficiencia biomecánica se ve suave, relajada y rítmica. Al observar jugar a un atleta, su postura física y fluidez de movimiento te dicen todo lo que necesitas saber sobre su zona de confort:'
                  : 'Biomechanical efficiency looks smooth, relaxed, and rhythmic. When observing an athlete play, their physical posture and movement fluidness tell you everything you need to know about their comfort zone:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Hacer el swing con una muñeca suelta y relajada y una aceleración fluida de la cadena cinética.'
                    : 'Swinging with a loose, relaxed wrist and fluid kinetic chain acceleration.'}
                </li>
                <li>
                  {isEs
                    ? 'Mostrar un lenguaje corporal tranquilo y analítico entre puntos en lugar de frustración frenética.'
                    : 'Exhibiting calm, analytical body language between points rather than frantic frustration.'}
                </li>
                <li>
                  {isEs
                    ? 'Demostrar confianza en su seguimiento espacial, sabiendo exactamente dónde picará la pelota.'
                    : 'Displaying confidence in their spatial tracking, knowing exactly where the ball will bounce.'}
                </li>
              </ul>
              <p>
                {isEs
                  ? 'La tensión muscular excesiva, apretar demasiado la empuñadura o los fallos de alta varianza son indicadores fisiológicos de que la velocidad entrante de la pelota está induciendo una respuesta de estrés subconsciente.'
                  : "Excessive muscle tightness, over-gripping the racket, or high-variance misses are physiological indicators that the ball's incoming speed is inducing a subconscious stress response."}
              </p>

              <div className="bg-[#f5f5f7] p-7 rounded-2xl my-9 border-l-4 border-[#1d1d1f]">
                <h3 className="text-lg font-semibold text-[#1d1d1f] mt-0 mb-2">
                  {isEs ? 'El Marco Estándar de Oro' : 'The Gold Standard Framework'}
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-base text-[#1d1d1f]">
                  <li>
                    {isEs
                      ? 'Si el jugador dicta y controla la trayectoria de la pelota, avanza la compresión.'
                      : "If the player dictates and controls the ball's path, advance the compression."}
                  </li>
                  <li>
                    {isEs
                      ? 'Si la velocidad entrante de la pelota dicta y controla la mecánica del jugador, mantén la compresión actual.'
                      : "If the incoming ball velocity dictates and controls the player's mechanics, retain the current compression."}
                  </li>
                </ol>
              </div>

              <div className="bg-[#0071e3]/6 p-6 rounded-2xl text-center font-semibold text-base sm:text-lg mt-10 border border-[#0071e3]/15 text-[#1d1d1f]">
                {isEs
                  ? 'El objetivo absoluto del desarrollo de jugadores no es avanzar más rápido, sino desarrollar una mecánica más limpia y mejorar con integridad estructural.'
                  : 'The absolute goal of player development is not to move faster — it is to develop cleaner mechanics and improve with structural integrity.'}
              </div>
            </>
          )}

          {/* 4. IMPORTANCE OF REPETITION */}
          {article.id === 'importance-of-repetition' && (
            <>
              <p>
                {isEs
                  ? 'La repetición es uno de los elementos más importantes de la mejora, tanto en el deporte como en el ámbito académico. Es a través de la repetición de acciones que ocurre el verdadero progreso.'
                  : 'Repetition is one of the most important elements of improvement, both in sports and in academics. It is through repeating actions that true progress happens.'}
              </p>
              <p>
                {isEs
                  ? 'Muchas personas creen que el éxito depende enteramente del talento natural. Pero la verdad es que el crecimiento real está impulsado por la dedicación a la práctica constante y sostenida hasta que una habilidad se convierte en segunda naturaleza. Ya sea que estés dominando una fórmula matemática compleja o intentando perfeccionar un golpe de tenis, las claves fundamentales del crecimiento son idénticas.'
                  : 'Many people believe that success comes entirely down to natural talent. But the truth is, real growth is driven by dedication to steady, consistent practice until a skill becomes second nature. Whether you are mastering a complex mathematical formula or trying to perfect a tennis swing, the foundational keys to growth are identical.'}
              </p>
              <p>
                {isEs
                  ? 'Aquí hay cuatro razones fundamentales por las que la repetición es el motor definitivo de la maestría:'
                  : 'Here are four core reasons why repetition is the ultimate driver of mastery:'}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? '1. Construye una "Memoria Muscular" Confiable' : '1. It Builds Reliable "Muscle Memory"'}
              </h2>
              <p>
                {isEs
                  ? 'Cuando intentas por primera vez un nuevo movimiento o estudias un nuevo concepto, requiere un enfoque consciente intenso porque el cerebro está construyendo una vía completamente nueva. A través de la repetición enfocada, un proceso biológico llamado neuroplasticidad toma el control:'
                  : 'When you first try a new movement or study a new concept, it requires intense conscious focus because the brain is building a brand-new pathway. Through focused repetition, a biological process called neuroplasticity takes over:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Las conexiones entre neuronas se vuelven físicamente más fuertes.'
                    : 'Connections between neurons grow physically stronger.'}
                </li>
                <li>
                  {isEs
                    ? 'Las vías activas desarrollan una capa protectora llamada mielina, acelerando la transmisión de señales.'
                    : 'Active pathways develop a protective layer called myelin, speeding up signal transmission.'}
                </li>
              </ul>
              <p>
                {isEs
                  ? 'Esto recablea la habilidad tan profundamente que pasa de ser un esfuerzo forzado y consciente a una ejecución automática.'
                  : 'This rewires the skill so deeply that it transitions from a forced, conscious effort into automatic execution.'}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? '2. Libera Capacidad Mental para la Estrategia' : '2. It Frees Up Mental Capacity for Strategy'}
              </h2>
              <p>
                {isEs
                  ? 'Cuando tu mecánica es automática, tu mente queda libre para pensar en el panorama general. Un jugador que ha conectado miles de golpes de fondo repetibles no tiene que pensar en el ángulo de su raqueta; en cambio, puede concentrarse en:'
                  : "When your mechanics are automatic, your mind is free to think about the bigger picture. A player who has hit thousands of repeatable groundstrokes doesn't have to think about their racket angle; instead, they can focus on:"}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Leer el posicionamiento del oponente al otro lado de la red.'
                    : "Reading the opponent's positioning across the net."}
                </li>
                <li>
                  {isEs
                    ? 'Formular estrategias de cancha y encontrar espacios abiertos.'
                    : 'Formulating court strategy and finding open spaces.'}
                </li>
                <li>
                  {isEs
                    ? 'Tomar decisiones tácticas rápidas y precisas bajo presión.'
                    : 'Making fast, sharp tactical decisions under pressure.'}
                </li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? '3. El Verdadero Progreso Ocurre Fuera de la Clase' : '3. True Progress Happens Outside the Lesson'}
              </h2>
              <p>
                {isEs
                  ? 'Si bien una hora de entrenamiento formal y enfocado con un entrenador tiene un valor increíble, la mejora real y duradera proviene de la consistencia independiente. El crecimiento requiere:'
                  : 'While a single hour of formal, focused training with a coach has incredible value, real lasting improvement comes from independent consistency. Growth requires:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Llevar los ejercicios a casa y practicar por cuenta propia.'
                    : 'Taking the drills home and practicing on your own time.'}
                </li>
                <li>
                  {isEs
                    ? 'Comprometerse con repeticiones diarias y constantes fuera de las clases formales.'
                    : 'Committing to steady, daily repetitions away from formal lessons.'}
                </li>
                <li>
                  {isEs
                    ? 'Invertir las horas silenciosas donde los hábitos realmente se consolidan.'
                    : 'Putting in the quiet hours where habits truly stick.'}
                </li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? '4. Genera una Confianza Inquebrantable' : '4. It Breeds Unshakable Confidence'}
              </h2>
              <p>
                {isEs
                  ? 'La ansiedad en la cancha o durante un examen suele provenir de la incertidumbre. La repetición reemplaza la duda con familiaridad. Cuando una habilidad se ha repetido con éxito miles de veces:'
                  : 'Anxiety on the court or during an exam usually comes from uncertainty. Repetition replaces doubt with familiarity. When a skill has been repeated successfully thousands of times:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  {isEs
                    ? 'Confías en que tu cuerpo responderá bajo presión.'
                    : 'You trust your body to perform under pressure.'}
                </li>
                <li>
                  {isEs
                    ? 'Te sientes completamente relajado y en control.'
                    : 'You feel completely relaxed and in control.'}
                </li>
                <li>
                  {isEs
                    ? 'Tu confianza crece porque la acción se ha convertido en segunda naturaleza.'
                    : 'Your confidence grows because the action has become second nature.'}
                </li>
              </ul>

              <div className="bg-[#f5f5f7] p-7 rounded-2xl my-9 border-l-4 border-[#1d1d1f]">
                <h3 className="text-lg font-semibold text-[#1d1d1f] mt-0 mb-2">
                  {isEs ? 'La Regla de la Repetición de Calidad' : 'The Quality Repetition Rule'}
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-base text-[#1d1d1f]">
                  <li>
                    {isEs
                      ? 'La repetición sin atención puede grabar accidentalmente malos hábitos técnicos.'
                      : 'Mindless repetition can accidentally engrain bad technical habits.'}
                  </li>
                  <li>
                    {isEs
                      ? 'La práctica deliberada —combinando alta repetición con enfoque activo y retroalimentación— es el único camino hacia la verdadera maestría.'
                      : 'Deliberate practice—combining high repetition with active focus and feedback—is the only path to true expertise.'}
                  </li>
                </ol>
              </div>

              <div className="bg-[#0071e3]/6 p-6 rounded-2xl text-center font-semibold text-base sm:text-lg mt-10 border border-[#0071e3]/15 text-[#1d1d1f]">
                {isEs
                  ? 'No practicamos hasta que nos sale bien — practicamos hasta que no nos puede salir mal.'
                  : 'We do not practice until we get it right — We practice until we cannot get it wrong.'}
              </div>
            </>
          )}

          {/* 5. THE COLORS OF COMPETITION (with exact original SVG court charts, bounce chart, and 3 YouTube videos) */}
          {article.id === 'color-of-competition' && (
            <>
              <p>
                {isEs
                  ? 'Para el ojo no entrenado, observar torneos de tenis juvenil o de desarrollo parece un festival caótico y multicolor. En una cancha, los niños corren por un espacio abreviado con pelotas gigantes de espuma. En otra, utilizan una cancha de tamaño estándar pero intercambian pelotas con pequeñas marcas verdes.'
                  : 'To the untrained eye, watching youth or developmental tennis tournaments looks like a chaotic, multi-colored festival. On one court, kids are scrambling across an abbreviated space with giant, squishy foam balls. On another, they are using a standard-sized court but trading balls bearing small green markings.'}
              </p>
              <p>
                {isEs
                  ? 'Esta estratificación estructural suele llamarse el marco de progresión juvenil. Sin embargo, persiste un gran mito entre los padres competitivos: la creencia de que estas etapas son una cuenta regresiva de cumpleaños. Muchos creen que tan pronto como un niño alcanza cierta edad, debe avanzar a una pelota de mayor velocidad.'
                  : 'This structural stratification is often called the youth progression framework. However, a major misconception persists within competitive parenting: the belief that these stages are a countdown of birthdays. Many believe that as soon as a child hits a specific age bracket, they must advance to a higher-speed ball.'}
              </p>
              <p>
                {isEs ? (
                  <>
                    Como analizamos previamente en nuestro artículo sobre{' '}
                    <button
                      onClick={() => onSelectArticle('slower-tennis-balls')}
                      className="text-[#0071e3] font-medium hover:underline cursor-pointer inline"
                    >
                      Por Qué las Pelotas de Tenis Más Lentas No Son Solo para Niños
                    </button>
                    , el escalado de equipamiento es una cuestión de ejecución funcional de habilidades, no de fechas del calendario. Pasar a un atleta a un entorno más rápido antes de que sus sistemas de seguimiento y movimiento se hayan automatizado destruirá su fluidez táctica e integridad mecánica.
                  </>
                ) : (
                  <>
                    As previously analyzed in our breakdown on{' '}
                    <button
                      onClick={() => onSelectArticle('slower-tennis-balls')}
                      className="text-[#0071e3] font-medium hover:underline cursor-pointer inline"
                    >
                      Why Slower Tennis Balls Are Not Just for Kids
                    </button>
                    , equipment scaling is a question of functional skill execution, not calendar dates. Moving an athlete up to a faster environment before their tracking and movement systems have fully automated will destroy their tactical fluency and mechanical integrity.
                  </>
                )}
              </p>
              <p>
                {isEs
                  ? 'Para comprender cómo se ve realmente una competición de desarrollo correcta, debemos desglosar la biomecánica, la matemática espacial y la ejecución visual a través de las tres etapas principales codificadas por colores del deporte.'
                  : 'To understand what correct developmental competition actually looks like, we must break down the biomechanics, spatial mathematics, and visual execution across the three primary color-coded stages of the sport.'}
              </p>

              {/* Red Stage */}
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '1. La Etapa Roja: Construyendo las Bases del Seguimiento Visual'
                  : '1. The Red Stage: Building the Foundations of Tracking'}
              </h2>
              <p>
                {isEs
                  ? 'El viaje comienza en la Cancha Roja. En este nivel introductorio, todo el entorno se reduce para adaptarse a estaturas más pequeñas y extremidades más cortas. El objetivo técnico es enseñar orientación espacial, recuperación fundamental del juego de pies y ángulos de contacto limpios sin forzar un instinto defensivo de supervivencia.'
                  : 'The journey begins on the Red Court. At this introductory tier, the entire environment is downsized to accommodate smaller statures and shorter limb lengths. The technical goal is to teach spatial orientation, foundational footwork recovery, and clean contact angles without forcing a defensive survival instinct.'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>{isEs ? 'Escala Espacial de la Cancha:' : 'Court Spatial Scale:'}</strong>{' '}
                  {isEs
                    ? 'Instalada a lo ancho de una cancha reglamentaria, mide exactamente 36 pies de largo por 18 pies de ancho. La red se baja a unos accesibles 33 pulgadas (2 pies, 9 pulgadas) en el centro.'
                    : 'Set up across the width of a regulation court, measuring precisely 36 feet long by 18 feet wide. The net is lowered to an accessible 33 inches (2 feet, 9 inches) at the center.'}
                </li>
                <li>
                  <strong>{isEs ? 'Dinámica y Física de la Pelota:' : 'Ball Dynamics & Physics:'}</strong>{' '}
                  {isEs
                    ? 'Las pelotas rojas son notablemente más grandes y están compuestas de fieltro de baja densidad o espuma. Viajan aproximadamente un 75% más lento que una pelota amarilla estándar y presentan una altura de rebote drásticamente restringida, manteniendo la pelota estrictamente dentro de la zona física de impacto del estudiante.'
                    : "Red balls are noticeably oversized and composed of low-density felt or foam. They travel roughly 75% slower than a standard yellow ball and feature a dramatically restricted rebound height, keeping the ball strictly within the student's physical strike zone."}
                </li>
              </ul>

              {/* Red Stage Videos */}
              <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-2xl my-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] bg-[#f5f5f7]">
                <iframe
                  title="Red Stage Video 1"
                  src="https://www.youtube.com/embed/eQ4BvpRZN-I"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-2xl my-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] bg-[#f5f5f7]">
                <iframe
                  title="Red Stage Video 2"
                  src="https://www.youtube.com/embed/KPU3WYp7aNA"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Orange Stage */}
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '2. La Etapa Naranja: Expandiendo los Límites Espaciales'
                  : '2. The Orange Stage: Expanding Spatial Boundaries'}
              </h2>
              <p>
                {isEs
                  ? 'Una vez que un atleta puede dictar consistentemente la profundidad del peloteo y moverse dinámicamente sin perder su centro de masa, pasa a la Etapa Naranja. Este entorno sirve como puente, poniendo a prueba la resistencia de movimiento lateral del jugador y obligándolo a evaluar la geometría de la cancha.'
                  : "Once an athlete can consistently dictate rally depth and move dynamically without losing their center of mass, they transition to the Orange Stage. This environment serves as a bridge, testing the player's lateral movement stamina and forcing them to start evaluating court geometry."}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>{isEs ? 'Escala Espacial de la Cancha:' : 'Court Spatial Scale:'}</strong>{' '}
                  {isEs
                    ? 'El espacio se expande significativamente a 60 pies de largo por 21 pies de ancho para individuales (extendiéndose a 27 pies para dobles). La red asciende a la altura reglamentaria de 36 pulgadas (3 pies) en la cinta central.'
                    : 'The space expands significantly to 60 feet long by 21 feet wide for singles (extending to 27 feet for doubles play). The net ascends to the regulation height of 36 inches (3 feet) at the center strap.'}
                </li>
                <li>
                  <strong>{isEs ? 'Dinámica y Física de la Pelota:' : 'Ball Dynamics & Physics:'}</strong>{' '}
                  {isEs
                    ? 'La pelota naranja coincide con las dimensiones estructurales de una pelota amarilla, pero está comprimida para viajar un 50% más lento. Su bote es más rápido y largo que el de una pelota roja, exigiendo mayor anticipación y una pre-activación más rápida del juego de pies.'
                    : 'The orange ball matches the structural dimensions of a yellow ball but is compressed to travel 50% slower. Its bounce is faster and longer than a red ball, demanding heightened anticipation and faster footwork pre-activation.'}
                </li>
              </ul>

              <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-2xl my-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] bg-[#f5f5f7]">
                <iframe
                  title="Orange Stage Video"
                  src="https://www.youtube.com/embed/2L1WpV0xPws"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Green Stage */}
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? '3. La Etapa Verde: Transición a la Cuadrícula Completa'
                  : '3. The Green Stage: Transitioning to the Full Grid'}
              </h2>
              <p>
                {isEs
                  ? 'La etapa de Punto Verde es el último escalón antes del juego estándar con pelota amarilla. Este nivel se desarrolla en la cancha adulta completa, pero conserva una matriz de pelota ligeramente escalada para garantizar que el procesamiento estratégico permanezca intacto durante intercambios de alta velocidad.'
                  : 'The Green Dot stage is the final stepping stone before standard yellow match play. This tier takes place on the complete adult court grid, but retains a slightly scaled ball matrix to ensure strategic processing remains intact during high-velocity exchanges.'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>{isEs ? 'Escala Espacial de la Cancha:' : 'Court Spatial Scale:'}</strong>{' '}
                  {isEs
                    ? 'Se juega en la cancha reglamentaria completa oficial: 78 pies de largo por 27 pies de ancho (individuales) o 36 pies de ancho (dobles), con una red estándar de 3 pies.'
                    : 'Played on the official regulation full-sized court: 78 feet long by 27 feet wide (singles) or 36 feet wide (doubles), with a standard 3-foot net line.'}
                </li>
                <li>
                  <strong>{isEs ? 'Dinámica y Física de la Pelota:' : 'Ball Dynamics & Physics:'}</strong>{' '}
                  {isEs
                    ? 'Las pelotas de punto verde son proyectiles de fieltro de tamaño estándar presurizados aproximadamente al 75% de la capacidad de una pelota amarilla, lo que hace que viajen un 25% más lento. La menor compresión evita que la pelota bote descontroladamente por encima de la línea de los hombros de un jugador en desarrollo, permitiéndole entrar a la cancha y tomar pelotas al subir (on the rise).'
                    : "Green dot balls are standard-sized felt projectiles pressurized at roughly 75% of a yellow ball's capacity, causing them to travel 25% slower. The lower compression prevents the ball from bouncing wildly over a developing player's shoulder line, allowing them to step in and take balls on the rise."}
                </li>
              </ul>

              {/* DIAGRAM 1: PLAY GRID BOUNDARIES (Exact Original 3-Column Chart) */}
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs
                  ? 'Visualizando los Límites de la Cuadrícula de Juego y el Escalado'
                  : 'Visualizing Play Grid Boundaries and Scaling'}
              </h2>
              <p>
                {isEs
                  ? 'Para comprender con precisión cuánto territorio espacial debe proteger un atleta en cada etapa, analiza la siguiente comparación espacial inspirada en el marco oficial de la ITF:'
                  : 'To accurately understand how much spatial territory an athlete is responsible for protecting across distinct segments, analyze the complete multi-stage spatial comparison below inspired by the official ITF blueprint framework:'}
              </p>

              <div className="bg-[#f5f5f7] border border-[#e5e5e7] rounded-[20px] p-5 sm:p-6 my-9">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* RED COLUMN */}
                  <div className="bg-white rounded-[14px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col text-center">
                    <div className="py-3 px-2 bg-[#d9383a] text-white font-bold text-base tracking-wide">
                      {isEs ? 'Roja' : 'Red'}
                    </div>
                    <div className="py-5 px-3 bg-[#fafafa] border-b border-[#f0f0f2] flex justify-center items-center">
                      <svg width="156" height="72" viewBox="0 0 156 72" className="max-w-full h-auto">
                        <rect width="156" height="72" fill="#41935c" />
                        <rect x="36" y="0" width="42" height="72" fill="rgba(217, 56, 58, 0.6)" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,1" />
                        <rect x="0" y="0" width="156" height="72" fill="none" stroke="#ffffff" strokeWidth="1" />
                        <line x1="0" y1="9" x2="156" y2="9" stroke="#ffffff" strokeWidth="1" />
                        <line x1="0" y1="63" x2="156" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="36" y1="9" x2="36" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="120" y1="9" x2="120" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="36" y1="36" x2="120" y2="36" stroke="#ffffff" strokeWidth="1" />
                        <line x1="78" y1="0" x2="78" y2="72" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3.5">
                      <div>
                        <div className="text-xs text-[#86868b] font-semibold mb-1">
                          {isEs ? 'Tamaño de Cancha' : 'Court Size'}
                        </div>
                        <div className="text-[0.95rem] font-semibold text-[#1d1d1f] font-mono-tabular">
                          36&apos; &times; 18&apos;
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#86868b] font-semibold mb-1">
                          {isEs ? 'Altura de Red' : 'Net Height'}
                        </div>
                        <div className="text-[0.95rem] font-semibold text-[#1d1d1f] font-mono-tabular">
                          {isEs ? '2\'9" Centro' : '2\'9" Center'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ORANGE COLUMN */}
                  <div className="bg-white rounded-[14px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col text-center">
                    <div className="py-3 px-2 bg-[#f28d35] text-white font-bold text-base tracking-wide">
                      {isEs ? 'Naranja' : 'Orange'}
                    </div>
                    <div className="py-5 px-3 bg-[#fafafa] border-b border-[#f0f0f2] flex justify-center items-center">
                      <svg width="156" height="72" viewBox="0 0 156 72" className="max-w-full h-auto">
                        <rect width="156" height="72" fill="#41935c" />
                        <rect x="18" y="9" width="120" height="54" fill="rgba(242, 141, 53, 0.6)" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,1" />
                        <rect x="0" y="0" width="156" height="72" fill="none" stroke="#ffffff" strokeWidth="1" />
                        <line x1="0" y1="9" x2="156" y2="9" stroke="#ffffff" strokeWidth="1" />
                        <line x1="0" y1="63" x2="156" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="36" y1="9" x2="36" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="120" y1="9" x2="120" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="36" y1="36" x2="120" y2="36" stroke="#ffffff" strokeWidth="1" />
                        <line x1="78" y1="0" x2="78" y2="72" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3.5">
                      <div>
                        <div className="text-xs text-[#86868b] font-semibold mb-1">
                          {isEs ? 'Tamaño de Cancha' : 'Court Size'}
                        </div>
                        <div className="text-[0.95rem] font-semibold text-[#1d1d1f] font-mono-tabular">
                          60&apos; &times; 21&apos;
                          <span className="block text-xs font-normal text-[#6e6e73]">
                            (60&apos; &times; 27&apos; {isEs ? 'Dobles' : 'Doubles'})
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#86868b] font-semibold mb-1">
                          {isEs ? 'Altura de Red' : 'Net Height'}
                        </div>
                        <div className="text-[0.95rem] font-semibold text-[#1d1d1f] font-mono-tabular">
                          {isEs ? '3\' Centro' : '3\' Center'}
                          <span className="block text-xs font-normal text-[#6e6e73]">
                            {isEs ? '3\'6" en Postes' : '3\'6" at Posts'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GREEN COLUMN */}
                  <div className="bg-white rounded-[14px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col text-center">
                    <div className="py-3 px-2 bg-[#5cb85c] text-white font-bold text-base tracking-wide">
                      {isEs ? 'Verde' : 'Green'}
                    </div>
                    <div className="py-5 px-3 bg-[#fafafa] border-b border-[#f0f0f2] flex justify-center items-center">
                      <svg width="156" height="72" viewBox="0 0 156 72" className="max-w-full h-auto">
                        <rect width="156" height="72" fill="#41935c" />
                        <rect x="0" y="9" width="156" height="54" fill="rgba(92, 184, 92, 0.5)" stroke="#ffffff" strokeWidth="1" />
                        <rect x="0" y="0" width="156" height="72" fill="none" stroke="#ffffff" strokeWidth="1" />
                        <line x1="0" y1="9" x2="156" y2="9" stroke="#ffffff" strokeWidth="1" />
                        <line x1="0" y1="63" x2="156" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="36" y1="9" x2="36" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="120" y1="9" x2="120" y2="63" stroke="#ffffff" strokeWidth="1" />
                        <line x1="36" y1="36" x2="120" y2="36" stroke="#ffffff" strokeWidth="1" />
                        <line x1="78" y1="0" x2="78" y2="72" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3.5">
                      <div>
                        <div className="text-xs text-[#86868b] font-semibold mb-1">
                          {isEs ? 'Tamaño de Cancha' : 'Court Size'}
                        </div>
                        <div className="text-[0.95rem] font-semibold text-[#1d1d1f] font-mono-tabular">
                          78&apos; &times; 27&apos;
                          <span className="block text-xs font-normal text-[#6e6e73]">
                            (78&apos; &times; 36&apos; {isEs ? 'Dobles' : 'Doubles'})
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#86868b] font-semibold mb-1">
                          {isEs ? 'Altura de Red' : 'Net Height'}
                        </div>
                        <div className="text-[0.95rem] font-semibold text-[#1d1d1f] font-mono-tabular">
                          {isEs ? '3\' Centro' : '3\' Center'}
                          <span className="block text-xs font-normal text-[#6e6e73]">
                            {isEs ? '3\'6" en Postes' : '3\'6" at Posts'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs sm:text-sm text-[#6e6e73] mt-4 font-medium leading-relaxed">
                  {isEs
                    ? 'Figura 1.0: Gráfico de alineación estructural que mapea los límites de juego escalados sobre las dimensiones estándar. Nota que Punto Verde y Amarilla Estándar utilizan exactamente la misma huella de línea de fondo.'
                    : 'Figure 1.0: Structural alignment chart mapping scaled playing boundaries over standard dimensions. Note that Green Dot and Standard Yellow utilize the exact same physical baseline footprint layout.'}
                </div>
              </div>

              {/* DIAGRAM 2: BALL BOUNCE CHART (Exact Original Rebound Arcs & Nodes) */}
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] pt-4">
                {isEs ? 'Visualizando la Mecánica de Rebote de la Pelota' : 'Visualizing Ball Rebound Mechanics'}
              </h2>
              <p>
                {isEs
                  ? 'Ralentizar la pelota no se trata solo de la velocidad en el aire: cambia la altura del bote, permitiendo a los jugadores practicar una mecánica óptima de impacto en lugar de golpear por encima de la cabeza:'
                  : "Slowing down the ball isn't just about speed through the air—it changes the height of the bounce, allowing players to practice optimal strike mechanics rather than reaching overhead:"}
              </p>

              <div className="my-8 bg-[#f5f5f7] border border-[#e5e5e7] rounded-[20px] p-5 sm:p-6">
                <div className="h-[220px] flex justify-around items-end border-b-[3px] border-[#1d1d1f] pb-2 relative mt-4">
                  {/* Red Bounce */}
                  <div className="flex flex-col items-center w-[55px] sm:w-[70px] h-full justify-end relative z-10">
                    <div className="absolute bottom-0 w-[40px] h-[56px] rounded-t-[100px] border-2 border-dashed border-[#d2d2d7] border-b-0" />
                    <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.65rem] font-bold text-white shadow-[0_4px_8px_rgba(0,0,0,0.15)] absolute bg-[#ff3b30] bottom-[45px]">
                      R
                    </div>
                  </div>
                  {/* Orange Bounce */}
                  <div className="flex flex-col items-center w-[55px] sm:w-[70px] h-full justify-end relative z-10">
                    <div className="absolute bottom-0 w-[40px] h-[106px] rounded-t-[100px] border-2 border-dashed border-[#d2d2d7] border-b-0" />
                    <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.65rem] font-bold text-white shadow-[0_4px_8px_rgba(0,0,0,0.15)] absolute bg-[#ff9500] bottom-[95px]">
                      O
                    </div>
                  </div>
                  {/* Green Bounce */}
                  <div className="flex flex-col items-center w-[55px] sm:w-[70px] h-full justify-end relative z-10">
                    <div className="absolute bottom-0 w-[40px] h-[156px] rounded-t-[100px] border-2 border-dashed border-[#d2d2d7] border-b-0" />
                    <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.65rem] font-bold text-white shadow-[0_4px_8px_rgba(0,0,0,0.15)] absolute bg-[#34c759] border-2 border-white bottom-[145px]">
                      G
                    </div>
                  </div>
                  {/* Yellow Bounce */}
                  <div className="flex flex-col items-center w-[55px] sm:w-[70px] h-full justify-end relative z-10">
                    <div className="absolute bottom-0 w-[40px] h-[206px] rounded-t-[100px] border-2 border-dashed border-[#d2d2d7] border-b-0" />
                    <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[0.65rem] font-bold text-[#1d1d1f] shadow-[0_4px_8px_rgba(0,0,0,0.15)] absolute bg-[#d4f900] bottom-[195px]">
                      Y
                    </div>
                  </div>
                </div>

                <div className="flex justify-around mt-3 text-center font-mono-tabular">
                  <div className="w-[55px] sm:w-[70px] text-xs sm:text-sm font-semibold text-[#ff3b30]">
                    {isEs ? 'Roja' : 'Red'}
                    <span className="block text-[11px] font-normal">~25% {isEs ? 'Alt' : 'Ht'}</span>
                  </div>
                  <div className="w-[55px] sm:w-[70px] text-xs sm:text-sm font-semibold text-[#ff9500]">
                    {isEs ? 'Naranja' : 'Orange'}
                    <span className="block text-[11px] font-normal">~50% {isEs ? 'Alt' : 'Ht'}</span>
                  </div>
                  <div className="w-[55px] sm:w-[70px] text-xs sm:text-sm font-semibold text-[#34c759]">
                    {isEs ? 'Verde' : 'Green'}
                    <span className="block text-[11px] font-normal">~75% {isEs ? 'Alt' : 'Ht'}</span>
                  </div>
                  <div className="w-[55px] sm:w-[70px] text-xs sm:text-sm font-semibold text-[#7a9600]">
                    {isEs ? 'Amarilla' : 'Yellow'}
                    <span className="block text-[11px] font-normal">100% {isEs ? 'Alt' : 'Ht'}</span>
                  </div>
                </div>

                <div className="text-center text-xs sm:text-sm text-[#6e6e73] mt-4 font-medium leading-relaxed">
                  {isEs
                    ? 'Figura 2.0: Métricas de rebote lineal que indican el mantenimiento estructural de la zona de impacto en relación con los parámetros de la pelota Amarilla estándar.'
                    : 'Figure 2.0: Linear rebound metrics indicating structural strike-zone maintenance relative to standard Yellow ball baseline parameters.'}
                </div>
              </div>

              <div className="bg-[#f5f5f7] p-7 rounded-2xl my-9 border-l-4 border-[#1d1d1f]">
                <h3 className="text-lg font-semibold text-[#1d1d1f] mt-0 mb-2">
                  {isEs ? 'La Regla Universal del Desarrollo' : 'The Universal Development Rule'}
                </h3>
                <p className="m-0 text-base text-[#1d1d1f]">
                  {isEs
                    ? 'Si pasas a un atleta a una cancha más grande o a una pelota de mayor velocidad demasiado rápido, desencadenas un estado fisiológico de supervivencia. Su trayectoria de swing se acortará, su mecánica de seguimiento se fracturará y su capacidad de pensar tácticamente caerá a cero. El avance debe ganarse mediante fluidez cinestésica y control estructural, nunca por la edad cronológica.'
                    : 'If you move an athlete to a larger court grid or a higher-velocity ball too quickly, you trigger a physiological survival state. Their swing path will shorten, their tracking mechanics will fracture, and their capacity to think tactically will drop to zero. Advancement must be earned through kinesthetic fluency and structural control, never by chronological age.'}
                </p>
              </div>

              <div className="bg-[#0071e3]/6 p-6 rounded-2xl text-center font-semibold text-base sm:text-lg mt-10 border border-[#0071e3]/15 text-[#1d1d1f]">
                {isEs
                  ? 'El objetivo absoluto del escalado es construir estrategas creativos en movimiento, no golpeadores estáticos en pánico por la velocidad entrante.'
                  : 'The absolute goal of scaling is to build creative, moving tacticians—not stationary strikers panicked by incoming speed.'}
              </div>
            </>
          )}

          {/* References Section */}
          <footer className="mt-14 pt-6 border-t border-[#d2d2d7]">
            <h3 className="text-sm font-semibold text-[#86868b] tracking-wider mb-3">
              {t.referencesHeading}
            </h3>
            <ul className="space-y-3 text-sm text-[#6e6e73] list-none pl-0">
              {article.references.map((ref, idx) => (
                <li key={idx} className="leading-relaxed">
                  <strong className="text-[#1d1d1f]">{ref.authors}</strong>{' '}
                  {ref.year && <span>({ref.year}). </span>}
                  <em>{ref.title}</em> {ref.publication}
                </li>
              ))}
            </ul>
          </footer>

          <footer className="mt-12 text-center pt-5 border-t border-[#d2d2d7] text-[#86868b] text-xs sm:text-sm">
            <p className="m-0">{t.copyright}</p>
          </footer>
        </section>
      </div>
    </div>
  );
};
