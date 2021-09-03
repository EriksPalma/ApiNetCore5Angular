using System;
using System.Collections.Generic;

#nullable disable

namespace pruebaItSense.Models
{
    public partial class Producto
    {
        public Producto()
        {
            ProductoEstados = new HashSet<ProductoEstado>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public int Codigo { get; set; }

        public virtual ICollection<ProductoEstado> ProductoEstados { get; set; }
    }
}
