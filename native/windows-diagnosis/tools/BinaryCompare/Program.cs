using System;
using System.IO;
using System.Linq;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;
class Program {
static string Hash(byte[] bytes)=>Convert.ToHexString(SHA256.HashData(bytes));
static string[] Inspect(string path) {
 using var pe=new PEReader(File.OpenRead(path));var m=pe.GetMetadataReader();
 var rows=m.MethodDefinitions.Select(h=>{var d=m.GetMethodDefinition(h);return "method "+m.GetString(d.Name)+" "+Hash(m.GetBlobBytes(d.Signature))+" "+(d.RelativeVirtualAddress==0?"none":Hash(pe.GetMethodBody(d.RelativeVirtualAddress).GetILBytes()));}).ToList();
 foreach(var h in m.ManifestResources){var d=m.GetManifestResource(h);var b=pe.GetSectionData(pe.PEHeaders.CorHeader.ResourcesDirectory.RelativeVirtualAddress+(int)d.Offset).GetReader();int n=b.ReadInt32(); rows.Add("resource "+m.GetString(d.Name)+" "+Hash(b.ReadBytes(n)));}
 foreach(var h in m.TypeDefinitions){var d=m.GetTypeDefinition(h);rows.Add("type "+m.GetString(d.Namespace)+"."+m.GetString(d.Name));}
 foreach(var h in m.MemberReferences){var d=m.GetMemberReference(h);rows.Add("reference "+m.GetString(d.Name)+" "+Hash(m.GetBlobBytes(d.Signature)));}
 return rows.ToArray();
}
static int Main(string[] a){var x=Inspect(a[0]);var y=Inspect(a[1]);Console.WriteLine("Original rows: "+x.Length+"; rebuild rows: "+y.Length+"; equal ordered method IL/signatures, resources, types, member refs: "+x.SequenceEqual(y));return x.SequenceEqual(y)?0:1;}
}
