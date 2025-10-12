export default function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ElektronMenu</h3>
            <p className="text-muted-foreground">
              Zamonaviy elektron menyu tizimi orqali eng yaxshi taomlarni buyurtma qiling.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Aloqa</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Telefon: +998 90 123 45 67</p>
              <p>Email: info@elektronmenu.uz</p>
              <p>Manzil: Toshkent, O'zbekiston</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ish vaqti</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Dushanba - Yakshanba</p>
              <p>09:00 - 23:00</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 ElektronMenu. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  )
}
