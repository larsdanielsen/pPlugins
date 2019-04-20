﻿using System;
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
            new Dog {
                Id = 1,
                Name = "Samson",
                Born = new DateTime(1999, 1, 25,  23, 55, 10),
                Breed = Dog.Breeds.BorderCollie,
                Image = "http://cdn1-www.dogtime.com/assets/uploads/2011/01/file_23178_border-collie-460x290.jpg",
                Link = ""
            },
            new Dog {
                Id = 2,
                Name = "Ronja",
                Born = new DateTime(2010, 8, 5,  23, 55, 10),
                Breed = Dog.Breeds.BeardedCollie,
                Image = "http://cdn3-www.dogtime.com/assets/uploads/2011/01/file_23170_bearded-collie-460x290.jpg",
                Link = ""
            },
            new Dog {
                Id = 3,
                Name = "Renka",
                Born = new DateTime(2012, 6, 2),
                Breed = Dog.Breeds.Borzoi,
                Image = "http://cdn1-www.dogtime.com/assets/uploads/2011/01/file_23018_borzoi-460x290.jpg",
                Link = ""
            },
            new Dog {
                Id = 4,
                Name = "Hektor",
                Born = new DateTime(2017, 1, 6),
                Breed = Dog.Breeds.Bulldog,
                Image = "http://cdn3-www.dogtime.com/assets/uploads/2011/01/file_23140_bulldog-460x290.jpg",
                Link = ""
            },
            new Dog {
                Id = 5,
                Name = "Rosa",
                Born = new DateTime(2016, 11, 19),
                Breed = Dog.Breeds.CairnTerrier,
                Image = "http://cdn2-www.dogtime.com/assets/uploads/2011/01/file_23062_cairn-terrier-460x290.jpg",
                Link = ""
            },
            new Dog {
                Id = 6,
                Name = "Frida",
                Born = new DateTime(2013, 4, 2),
                Breed = Dog.Breeds.Cockapoo,
                Image = "http://cdn2-www.dogtime.com/assets/uploads/2011/01/file_23218_cockapoo-dog-breed.jpg",
                Link = "http://dogtime.com/dog-breeds/cockapoo"
            },
            new Dog {
                Id = 7,
                Name = "Sille",
                Born = new DateTime(2014, 10, 20),
                Breed = Dog.Breeds.ShihTzu,
                Image = "http://cdn2-www.dogtime.com/assets/uploads/2011/01/file_23126_shih-tzu-460x290.jpg",
                Link = "http://dogtime.com/dog-breeds/shih-tzu  "
            },
            new Dog {
                Id = 8,
                Name = "Tjalfe",
                Born = new DateTime(2001, 10, 20),
                Breed = Dog.Breeds.Rottweiler,
                Image = "http://cdn2-www.dogtime.com/assets/uploads/2011/01/file_22942_rottweiler-460x290.jpg",
                Link = "http://dogtime.com/dog-breeds/rottweiler"
            },
            new Dog {
                Id = 9,
                Name = "Sofus",
                Born = new DateTime(2009, 5, 30),
                Breed = Dog.Breeds.LhasaApso,
                Image = "http://cdn2-www.dogtime.com/assets/uploads/2011/01/file_23154_lhasa-apso-460x290.jpg"
            },
            new Dog {
                Id = 10,
                Name = "Otto",
                Born = new DateTime(2012, 1, 3),
                Breed = Dog.Breeds.BorderTerrier,
                Image = "https://cdn3-www.dogtime.com/assets/uploads/2011/01/file_23058_border-terrier-460x290.jpg"
            },
            new Dog {
                Id = 11,
                Name = "Freja",
                Born = new DateTime(2012, 10, 3),
                Breed = Dog.Breeds.Lowchen,
                Image = "https://cdn3-www.dogtime.com/assets/uploads/2011/01/file_23156_lowchen-460x290.jpg",
                Link = "https://dogtime.com/dog-breeds/lowchen"
            }
        };

        var js = new JavaScriptSerializer();
        Context.Response.ContentType = "application/json";
        Context.Response.Write(js.Serialize(dogs));

    }

    public class Dog
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public Breeds Breed { get; set; }
        public string Image { get; set; }

        public DateTime Born { get; set; }

        public string BreedName
        {
            get
            {
                switch (Breed)
                {
                    case Breeds.BorderCollie:
                        return "Border Collie";
                    case Breeds.BorderTerrier:
                        return "Border Terrier";
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
                    case Breeds.ShihTzu:
                        return "Shih Tzu";
                    case Breeds.Rottweiler:
                        return "Rottweiler";
                    case Breeds.LhasaApso:
                        return "Lhasa Apso";
                    case Breeds.Lowchen:
                        return "Löwchen";
                    default:
                        return "Ukendt race";
                }
            }
        }

        public string Link { get; internal set; }

        public enum Breeds
        {
            UnKnown,
            BorderCollie,
            BeardedCollie,
            Borzoi,
            Bulldog,
            CairnTerrier,
            Cockapoo,
            ShihTzu,
            Rottweiler,
            LhasaApso,
            BorderTerrier,
            Lowchen
        }
    }

}
