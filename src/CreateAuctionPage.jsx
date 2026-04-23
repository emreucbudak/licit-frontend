const previewImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCEmI0z_YuP3x3BkXaINgNm4oQ4DHezF5XTTEjwh-70YPkKbgx1IYxq0koBKWQccZpreJLFFpkezKTdgTNXPtUqrgOOZKYT8ckcuXNQDwdeEtxj-jt-Geql1-IRNTpvgp35ZDgHl74pVzf5DjITuyboTLPceLctGcnbD84hh9THRfLtGsLfE3L0mGr4gvuKiHkanvdupB8_Ky44VsZ-lMtOfaC17lsVJBXbRLe2U9nd78B8OBiMbRtCAyzVnakb_FXHaf6Rh93fPlY'

function CreateAuctionPage({ navigate }) {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <nav className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between gap-4 border-b border-outline-variant/20 bg-[#0b1326]/95 px-4 py-3 backdrop-blur lg:px-6">
        <div className="flex min-w-0 items-center gap-8">
          <a
            className="text-2xl font-black uppercase tracking-tighter text-white"
            href="/"
            onClick={navigate('/')}
          >
            Licit
          </a>
          <label className="hidden items-center rounded-lg bg-surface-container-low px-4 py-1.5 md:flex">
            <span className="material-symbols-outlined mr-2 text-sm text-slate-400">
              search
            </span>
            <input
              className="w-64 border-none bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:ring-0"
              placeholder="Müzayede ara..."
              type="text"
            />
          </label>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
          <button
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800/50"
            type="button"
            aria-label="Bildirimler"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800/50"
            type="button"
            aria-label="Hesap"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col gap-2 bg-surface-container-low p-4 pt-16 text-sm font-medium shadow-2xl shadow-black/20 lg:flex">
        <div className="mb-6 mt-4 rounded-xl bg-surface-container-high/40 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-container/20">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <p className="m-0 font-bold leading-none text-white">Koleksiyoner</p>
              <p className="mt-1 text-xs text-slate-400">Doğrulanmış Üye</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <a
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-white"
            href="/auctions"
            onClick={navigate('/auctions')}
          >
            <span className="material-symbols-outlined">gavel</span>
            Canlı Müzayedeler
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-white"
            href="/dashboard"
            onClick={navigate('/dashboard')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Panel
          </a>
          <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-white" href="#">
            <span className="material-symbols-outlined">category</span>
            Koleksiyonlar
          </a>
          <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-white" href="#">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            Cüzdan
          </a>
          <a
            className="flex items-center gap-3 rounded-lg bg-slate-800/70 px-4 py-3 text-white transition-colors"
            href="/auctions/create"
            onClick={navigate('/auctions/create')}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add_circle
            </span>
            Müzayede Oluştur
          </a>
          <a className="mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-white" href="#">
            <span className="material-symbols-outlined">help</span>
            Yardım Merkezi
          </a>
          <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-white" href="#">
            <span className="material-symbols-outlined">logout</span>
            Çıkış Yap
          </a>
        </nav>
      </aside>

      <main className="min-h-screen px-4 pb-28 pt-24 sm:px-6 lg:ml-64 lg:px-8 lg:pb-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Yeni Başvuru
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
                Yeni Müzayede Lotu Oluştur
              </h1>
              <p className="mt-2 max-w-lg text-on-surface-variant">
                Değerli varlığını listele. Alıcı güvenini artırmak için detaylı
                özellikler ve net bilgiler ekle.
              </p>
            </div>

            <div className="hidden gap-3 md:flex">
              <button className="rounded-lg border border-outline-variant/20 bg-surface-container-high px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-surface-container-highest" type="button">
                Taslak Kaydet
              </button>
              <button className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-90" type="button">
                Müzayedeyi Yayına Al
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form className="space-y-8 lg:col-span-7" onSubmit={handleSubmit}>
              <section className="rounded-xl bg-surface-container-low p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                  <span className="material-symbols-outlined text-primary-container">
                    info
                  </span>
                  Ürün Detayları
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Ürün Başlığı
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-primary-container"
                      placeholder="Örn. Nadir Vintage Kronograf 1964"
                      type="text"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Kategori
                      </label>
                      <select className="w-full appearance-none rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary-container">
                        <option>Saatler</option>
                        <option>Güzel Sanatlar</option>
                        <option>Dijital Varlıklar</option>
                        <option>Koleksiyon Ürünleri</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Başlangıç Fiyatı ($)
                      </label>
                      <input
                        className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-primary-container"
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Açıklama
                    </label>
                    <textarea
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface placeholder:text-slate-600 transition-all focus:ring-2 focus:ring-primary-container"
                      placeholder="Ürünün geçmişini, durumunu ve öne çıkan özelliklerini anlat..."
                      rows="6"
                    ></textarea>
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-surface-container-low p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                  <span className="material-symbols-outlined text-primary-container">
                    schedule
                  </span>
                  Müzayede Takvimi
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Süre
                    </label>
                    <select className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary-container">
                      <option>3 Gün</option>
                      <option>5 Gün</option>
                      <option>7 Gün</option>
                      <option>14 Gün</option>
                      <option>Özel Tarih...</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Başlangıç Tarihi
                    </label>
                    <input
                      className="w-full rounded-lg border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface transition-all focus:ring-2 focus:ring-primary-container"
                      type="date"
                    />
                  </div>
                </div>
              </section>
            </form>

            <aside className="space-y-8 lg:col-span-5">
              <section className="rounded-xl bg-surface-container-low p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                  <span className="material-symbols-outlined text-primary-container">
                    image
                  </span>
                  Ürün Resimleri
                </h2>
                <button
                  className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest/50 p-8 transition-colors hover:border-primary-container/50"
                  type="button"
                >
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/10 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl text-primary-container">
                      upload_file
                    </span>
                  </span>
                  <span className="mb-1 font-medium text-white">
                    Yüksek çözünürlüklü görselleri sürükle ve bırak
                  </span>
                  <span className="mb-6 text-center text-sm text-on-surface-variant">
                    PNG, JPG veya WEBP desteklenir. En fazla 20MB. Önerilen oran 4:3.
                  </span>
                  <span className="rounded-lg border border-primary-container/20 bg-primary-container/10 px-4 py-2 text-sm font-bold text-primary-container transition-colors group-hover:bg-primary-container/20">
                    Dosya Seç
                  </span>
                </button>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container-high">
                    <img
                      alt="Koyu taş yüzey üzerinde beyaz kadranlı minimalist gümüş kol saati"
                      className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-100"
                      src={previewImage}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="material-symbols-outlined text-sm text-white">
                        delete
                      </span>
                    </div>
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-outline-variant/20 bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-slate-700">add</span>
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-outline-variant/20 bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-slate-700">add</span>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-outline-variant/10 bg-gradient-to-br from-surface-container-high to-surface-container-low p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container/20">
                    <span className="material-symbols-outlined text-secondary">
                      verified
                    </span>
                  </div>
                  <h3 className="font-bold text-white">Licit Pro İpuçları</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-1 text-sm text-primary">
                      check_circle
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Detaylı açıklamalar teklif verme oranını ciddi şekilde artırır.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-1 text-sm text-primary">
                      check_circle
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Hafta sonuna yayılan müzayedeler genellikle daha yüksek etkileşim alır.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-1 text-sm text-primary">
                      check_circle
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Farklı açılardan en az 3 yüksek çözünürlüklü fotoğraf ekle.
                    </p>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-white/5 bg-[#0b1326] p-4 md:hidden">
        <button className="flex-1 rounded-lg bg-surface-container-high py-3 text-sm font-semibold text-white" type="button">
          Taslak Kaydet
        </button>
        <button className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-on-primary" type="button">
          Yayına Al
        </button>
      </div>
    </div>
  )
}

export default CreateAuctionPage
