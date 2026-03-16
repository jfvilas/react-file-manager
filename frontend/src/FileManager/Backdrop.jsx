const Backdrop = ({ isLocked, message = 'Loading...' }) => {
  if (!isLocked) return null;

  return (
    <div className="backdrop">
		<div className="backdrop-container">
			<div className="backdrop-spinner"></div>
		<p className="backdrop-text">{message}</p>
		</div>
    </div>
  )
}

export { Backdrop }