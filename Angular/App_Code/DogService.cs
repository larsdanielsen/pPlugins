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
            new Dog { Id = 1, Name = "Samson", Breed = Dog.Breeds.BorderCollie, Image = "http://cdn1-www.dogtime.com/assets/uploads/2011/01/file_23178_border-collie-460x290.jpg" },
            new Dog { Id = 2, Name = "Ronja", Breed = Dog.Breeds.BeardedCollie, Image = "http://cdn3-www.dogtime.com/assets/uploads/2011/01/file_23170_bearded-collie-460x290.jpg"},
            new Dog { Id = 3, Name = "Renka", Breed = Dog.Breeds.Borzoi, Image = "http://cdn1-www.dogtime.com/assets/uploads/2011/01/file_23018_borzoi-460x290.jpg"},
            new Dog { Id = 4, Name = "Hektor", Breed = Dog.Breeds.Bulldog, Image = "http://cdn3-www.dogtime.com/assets/uploads/2011/01/file_23140_bulldog-460x290.jpg"},
            new Dog { Id = 5, Name = "Rosa", Breed = Dog.Breeds.CairnTerrier, Image = "http://cdn2-www.dogtime.com/assets/uploads/2011/01/file_23062_cairn-terrier-460x290.jpg"},
           new Dog { Id = 6, Name = "Frida", Breed = Dog.Breeds.Cockapoo, Image = "http://cdn2-www.dogtime.com/assets/uploads/2011/01/file_23218_cockapoo-dog-breed.jpg"},

        };
        var js = new JavaScriptSerializer();
        Context.Response.Write(js.Serialize(dogs));
    }

    public class Dog
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public Breeds Breed { get; set; }
        public string Image { get; set; }

        public string BreedName
        {
            get
            {
                switch (Breed)
                {
                    case Breeds.BorderCollie:
                        return "Border Collie";
                    case Breeds.UnKnown:
                        return "Ukendt race";
                    case Breeds.BeardedCollie:
                        return "Bearded Collie";
                    case Breeds.Borzoi:
                        return "Borzoi";
                    case Breeds.Bulldog:
                        return "Bulldog";
                    case Breeds.CairnTerrier:
                        return "Cairn Terrier";
                    case Breeds.Cockapoo:
                        return "Cockapoo";
                    default:
                        return "Ukendt race";
                }
            }
        }

        public enum Breeds
        {
            UnKnown,
            BorderCollie,
            BeardedCollie,
            Borzoi,
            Bulldog,
            CairnTerrier,
            Cockapoo
        }
    }

}
