function PageLayout({ title, description, children }) {
  return (
    <main className="page-section">
      <div className="container-app space-y-6">
        {(title || description) ? (
          <div className="space-y-2">
            {title ? (
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            ) : null}

            {description ? (
              <p className="max-w-2xl text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
        ) : null}

        <div>{children}</div>
      </div>
    </main>
  );
}

export default PageLayout;