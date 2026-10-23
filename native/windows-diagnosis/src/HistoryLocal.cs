using System;
using System.IO;
using System.Security.Cryptography;
using Microsoft.VisualBasic.FileIO;

namespace Gemnao.Diagnostics
{
    internal static class HistoryLocal
    {
        private const int MaxEncryptedBytes=65536;
        private static string Folder(bool create)
        {
            string local=Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            if(!LocalGuard.Allowed(local))throw new IOException();
            foreach(string name in new[]{"Gemnao","GameDiagnosis"})
            {
                local=Path.Combine(local,name);
                if(!LocalGuard.Allowed(local,true))throw new IOException();
                if(create)Directory.CreateDirectory(local);
                if(!create&&!Directory.Exists(local))throw new FileNotFoundException();
                if(!LocalGuard.Allowed(local))throw new IOException();
            }
            return local;
        }
        internal static void Save(ActionJournal history)
        {
            byte[] data=ProtectedData.Protect(history.Encode(),null,DataProtectionScope.CurrentUser);
            if(data.Length>MaxEncryptedBytes)throw new IOException();
            string folder=Folder(true),path=Path.Combine(folder,"history-v2.dat"),temp=Path.Combine(folder,"history-v2.tmp");
            if(!LocalGuard.Allowed(path,true)||!LocalGuard.Allowed(temp,true))throw new IOException();
            // Own app file only. Atomic replacement leaves the old file intact if writing fails.
            using(var file=new FileStream(temp,FileMode.Create,FileAccess.Write,FileShare.None)){file.Write(data,0,data.Length);file.Flush(true);}
            if(!LocalGuard.Allowed(path,true)||!LocalGuard.Allowed(temp))throw new IOException();
            if(File.Exists(path))File.Replace(temp,path,null);else File.Move(temp,path);
        }
        internal static ActionJournal Load()
        {
            string path=Path.Combine(Folder(false),"history-v2.dat");if(!LocalGuard.Allowed(path))throw new IOException();
            byte[] data;
            using(var file=new FileStream(path,FileMode.Open,FileAccess.Read,FileShare.Read))
            {
                if(file.Length>MaxEncryptedBytes)throw new IOException();data=new byte[(int)file.Length];int at=0,n;
                while(at<data.Length&&(n=file.Read(data,at,data.Length-at))>0)at+=n;if(at!=data.Length||file.ReadByte()!=-1)throw new IOException();
            }
            byte[] plain=ProtectedData.Unprotect(data,null,DataProtectionScope.CurrentUser);return ActionJournal.Decode(plain);
        }
        internal static void RecycleSavedHistory()
        {
            string folder=Folder(false);
            foreach(string name in new[]{"history-v2.dat","history-v2.tmp"})
            {
                string path=Path.Combine(folder,name);if(!File.Exists(path))continue;
                if(!LocalGuard.Allowed(path))throw new IOException();
                FileSystem.DeleteFile(path,UIOption.AllDialogs,RecycleOption.SendToRecycleBin,UICancelOption.ThrowException);
            }
        }
    }
}
