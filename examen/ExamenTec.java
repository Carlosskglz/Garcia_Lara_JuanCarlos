package examen;
import java.util.Scanner;
public class ExamenTec {
    public static void main(String[] args) {
        Scanner leer = new Scanner(System.in);
        
        OUTER:
        while (true){
            System.out.println("---Menu de opciones Examen---");
            System.out.println("1) ir a la opcion 1");
            System.out.println("2) ir a la opcion 2");
            System.out.println("3) Salir");
            int opcion = leer.nextInt();
            leer.nextLine();
            
            switch (opcion){
                case 1:
                    System.out.println("Registro de datos");
                    System.out.print("Ingrese su nombre: ");
                    String nombre = leer.nextLine();
                    System.out.print("Ingrese su apellido Paterno: ");
                    String apellidoP = leer.nextLine();
                    System.out.print("Ingrese su apellido Materno: ");
                    String apellidoM = leer.nextLine();
                    System.out.println("Ingrese su fecha de nacimiento (dia, mes y año respectivamente: ");
                    int dia = leer.nextInt();
                    int mes = leer.nextInt();
                    int año = leer.nextInt();
                    
                    System.out.println("-------------DATOS-----------");
                    System.out.println("Nombre: " + nombre);
                    System.out.println("Apellido Paterno: " + apellidoP);
                    System.out.println("Apellido Materno: " + apellidoM);
                    System.out.println("Fecha de nacimiento: " + dia + "/" + mes + "/" + año);
                    break;
                    
                case 2:
                    System.out.println("Calculo del volumen de una figura");
                    System.out.println("De que figura desea calcular su volumen?");
                    System.out.println("1) Prisma Rectangular");
                    System.out.println("2) Piramide");
                    int opFigura = leer.nextInt();
                    leer.nextLine();
                    
                    if (opFigura == 1){
                        System.out.print("Ingrese el largo de la figura: ");
                        double largo = leer.nextDouble();
                        System.out.print("Ingrese el ancho de la figura: ");
                        double ancho = leer.nextDouble();
                        System.out.print("Ingrese la altura de la figura:  ");
                        double altura = leer.nextDouble();
                        
                        double volumen = largo*ancho*altura;
                        System.out.println("El volumen del prisma es: " + volumen);
                                
                    } else if (opFigura ==2){
                        System.out.print("Ingrese el ancho de la base: ");
                        double ancho = leer.nextDouble();
                        System.out.print("Ingrese el largo de la base: ");
                        double largo = leer.nextDouble();
                        System.out.print("Ingrese la altura de la figura:  ");
                        double altura = leer.nextDouble();
                        
                        double areaBase= ancho*largo;
                        double volumenI = areaBase*altura;
                        double volumenF = volumenI/3;
                        System.out.println("El volumen de la piramide es de: " + volumenF);
                    } else {
                        System.out.println("Opcion Invalida");
                    }
                            
                    
                    break;
                case 3: 
                    break OUTER;
            }
            
        }
    }
    
}