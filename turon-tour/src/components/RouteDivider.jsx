// Signature-элемент: пунктирная линия-«маршрут» с иконкой самолёта между секциями.
// Иконка — SVG (не эмодзи), в фирменном цвете.
export default function RouteDivider() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="route-divider py-2" role="presentation">
        <span className="route-divider__pin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 -rotate-45"
            aria-hidden
          >
            <path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l4.2 4.2-2.5 2.5-2-.5a.5.5 0 0 0-.5.8l2 2 2 2a.5.5 0 0 0 .8-.5l-.5-2 2.5-2.5 4.2 4.2a.5.5 0 0 0 .8-.5Z" />
          </svg>
        </span>
      </div>
    </div>
  )
}
