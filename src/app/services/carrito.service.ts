import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito : Producto[] = [];
  
    agregarProducto(producto :Producto) {
      this.carrito.push(producto);
    }

      obtenerCarrito() : Producto[] {
        return this.carrito;
      }

      eliminarProducto(index:number){
        this.carrito.splice(index,1);
      }

  generarXML() : string {

    let fecha = new Date().toISOString().split("T")[0];
    let folio = "123";
    let clienteNombre = "Dafne";
    let clienteEmail = "dafne@gmail.com"
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?> \n <factura> \n`;

    xml += `<info>\n`;
    xml += `<folio>${folio}</folio>\n`;
    xml += `<fecha>${fecha}</fecha>\n`;
    xml += `<cliente>\n`;
    xml += `<nombre>${clienteNombre}</nombre>\n`;
    xml += `<email>${clienteEmail}</email>\n`;
    xml += `</cliente>\n`;
    xml += `</info>\n`;

    let productosAgrupados: { [id: number]: { nombre: string; cantidad: number; precio: number } } = {};
    let subtotal = 0;

    this.carrito.forEach((producto)=>{
      if (productosAgrupados[producto.id]) {
        productosAgrupados[producto.id].cantidad += 1;
      } else {
        productosAgrupados[producto.id] = { nombre: producto.nombre, cantidad: 1, precio: producto.precio };
      }
    });

    xml += `  <productos>\n`;
    for (const id in productosAgrupados) {
      let producto = productosAgrupados[id];
      let subTotalProducto = producto.cantidad * producto.precio;
      subtotal += subTotalProducto;

      xml += `<producto>\n`;
      xml += `<id>${id}</id>\n`;
      xml += `<descripcion>${producto.nombre}</descripcion>\n`;
      xml += `<cantidad>${producto.cantidad}</cantidad>\n`;
      xml += `<precioUnitario>${producto.precio.toFixed(2)}</precioUnitario>\n`;
      xml += `<subtotal>${subTotalProducto.toFixed(2)}</subtotal>\n`;
      xml += `</producto>\n`;
    }
    xml += `</productos>\n`;

    let iva = subtotal * 0.16;
    let total = subtotal + iva;

    xml += `<totales>\n`;
    xml += `<subtotal>${subtotal.toFixed(2)}</subtotal>\n`;
    xml += `<impuestos>\n`;
    xml += `<iva>${iva.toFixed(2)}</iva>\n`;
    xml += `</impuestos>\n`;
    xml += `<total>${total.toFixed(2)}</total>\n`;
    xml += `</totales>\n`;

    xml += `</factura>`;
    return xml;
  }

  descargarxml(xml : string, fileName : string){
    const blob = new Blob([xml], 
      {type : 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
}
