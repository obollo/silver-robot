import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { popularityLabel } from '../data/names';
import { useLanguage } from '../i18n/LanguageContext';
import { translateMeaning } from '../i18n/meanings';

const SWIPE_THRESHOLD = 100;

export default function NameCard({ name, onLike, onDislike }) {
  const { t, lang } = useLanguage();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const likeOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const dislikeOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);

  const { label: popLabelKey, color: popColor } = popularityLabel(name.popularity);
  const popLabel = t(`popularity.${popLabelKey}`);

  const genderColor = {
    boy: 'text-blue-500',
    girl: 'text-pink-500',
    neutral: 'text-violet-500',
  }[name.gender];

  const genderEmoji = { boy: '💙', girl: '🩷', neutral: '✨' }[name.gender];

  const handleDragEnd = (_, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      animate(x, 600, { duration: 0.3 }).then(onLike);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      animate(x, -600, { duration: 0.3 }).then(onDislike);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      className="w-full cursor-grab active:cursor-grabbing no-select"
    >
      <div className="mx-4 rounded-3xl bg-white shadow-2xl shadow-gray-200/80 overflow-hidden">
        {/* Card top gradient band */}
        <div
          className={`h-2 w-full ${
            name.gender === 'boy'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
              : name.gender === 'girl'
              ? 'bg-gradient-to-r from-pink-400 to-rose-400'
              : 'bg-gradient-to-r from-violet-400 to-purple-400'
          }`}
        />

        {/* Like / Dislike overlays */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 right-6 z-10 border-4 border-emerald-500 rounded-xl px-3 py-1 rotate-[-15deg]"
        >
          <span className="text-emerald-500 font-black text-2xl tracking-widest">LIKE</span>
        </motion.div>
        <motion.div
          style={{ opacity: dislikeOpacity }}
          className="absolute top-6 left-6 z-10 border-4 border-red-400 rounded-xl px-3 py-1 rotate-[15deg]"
        >
          <span className="text-red-400 font-black text-2xl tracking-widest">NOPE</span>
        </motion.div>

        {/* Card content */}
        <div className="px-7 py-8">
          {/* Gender badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-lg">{genderEmoji}</span>
            <span className={`text-xs font-semibold uppercase tracking-widest ${genderColor}`}>
              {t(`gender.${name.gender}`)}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-6xl font-black text-gray-800 tracking-tight leading-none mb-1">
            {name.name}
          </h1>

          {/* Origin */}
          <p className="text-sm text-gray-400 font-medium mb-6">
            {t(`origin.${name.origin}`)} {t('card.originSuffix')}
          </p>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-5" />

          {/* Meaning */}
          <div className="mb-5">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
              {t('card.meaning')}
            </p>
            <p className="text-gray-700 text-lg font-medium leading-snug">
              "{translateMeaning(name.meaning, lang)}"
            </p>
          </div>

          {/* Style tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {name.styles.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-xs font-medium"
              >
                {t(`style.${s}`)}
              </span>
            ))}
          </div>

          {/* Popularity */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
                {t('card.popularity')}
              </p>
              <p className={`font-bold text-sm ${popColor}`}>
                {popLabel}
                <span className="text-gray-400 font-normal ml-1">
                  #{name.popularity} {t('card.ranked')}
                </span>
              </p>
            </div>
            <PopularityBar rank={name.popularity} label={t('card.popularityBar')} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PopularityBar({ rank, label }) {
  const score = Math.max(0, Math.min(100, 100 - (rank / 10)));
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-pink-400 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
