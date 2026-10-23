using System;
using System.Windows.Forms;

namespace Gemnao.Diagnostics
{
    internal static class Program
    {
        [STAThread]
        private static void Main()
        {
            L.SetLanguage(System.Globalization.CultureInfo.CurrentUICulture.Name);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }
}
