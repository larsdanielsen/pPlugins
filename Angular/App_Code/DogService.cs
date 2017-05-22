using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// Summary description for DogService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class DogService : System.Web.Services.WebService
{

    public DogService()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public void GetData(int delay)
    {
        Thread.Sleep(delay);

        var dogs = new List<Dog>
        {
            new Dog { Id = 1, Name = "Fido", Breed = Dog.Breeds.BorderCollie },
            new Dog { Id = 2, Name = "Gromit", Breed = Dog.Breeds.UnKnown }
        };
        var js = new JavaScriptSerializer();
        Context.Response.Write(js.Serialize(dogs));
    }

    public class Dog
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public Breeds Breed { get; set; }

        public enum Breeds
        {
            UnKnown = 0,
            BorderCollie = 1
        }
    }

}
