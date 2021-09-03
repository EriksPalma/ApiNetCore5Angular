using System;
using System.Collections.Generic;

#nullable disable

namespace pruebaItSense.Models
{
    public partial class ProductoEstado
    {
        public int Id { get; set; }
        public int IdProducto { get; set; }
        public int IdEstado { get; set; }
        public int Cantidad { get; set; }

        public virtual Estado IdEstadoNavigation { get; set; }
        public virtual Producto IdProductoNavigation { get; set; }
    }
}
