/**
 * PageHero — reusable top banner for interior pages
 * Props: eyebrow, title, subtitle, imgSrc, imgAlt
 */
export default function PageHero({ eyebrow, title, subtitle, imgSrc, imgAlt }) {
  return (
    <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {imgSrc ? (
          <img src={imgSrc} alt={imgAlt || ''} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary-fixed/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>
      <div className="relative z-10 max-w-container-max mx-auto px-10 w-full">
        <span className="section-eyebrow">{eyebrow}</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface leading-tight max-w-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-on-surface-variant text-lg mt-4 max-w-lg leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
