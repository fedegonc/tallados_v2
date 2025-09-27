type PriceSummarySection = {
  label: string;
  amount: number;
  helper?: string;
  icon?: string;
};

type PriceSummaryProps = {
  sections: PriceSummarySection[];
  total: number;
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const PriceSummary = ({ sections, total }: PriceSummaryProps) => {
  return (
    <section className="summary">
      <h2 className="summary__title">Resumen</h2>
      <ul className="summary__list">
        {sections.map((section) => (
          <li key={section.label} className="summary__item">
            <div className="summary__item-left">
              {section.icon && <span className="summary__item-icon" aria-hidden>{section.icon}</span>}
              <div>
                <span className="summary__item-label">{section.label}</span>
                {section.helper && <small className="summary__item-helper">{section.helper}</small>}
              </div>
            </div>
            <span className="summary__item-amount">{currencyFormatter.format(section.amount)}</span>
          </li>
        ))}
      </ul>
      <hr className="summary__divider" />
      <div className="summary__total">
        <span>Total estimado</span>
        <strong>{currencyFormatter.format(total)}</strong>
      </div>
    </section>
  );
};

export type { PriceSummarySection };
export default PriceSummary;
