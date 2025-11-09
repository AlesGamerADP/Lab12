import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
  
      const author = await prisma.author.findUnique({
        where: { id },
        include: { books: true }
      });
  
      if (!author) {
        return NextResponse.json({ error: "Autor no encontrado" }, { status: 404 });
      }
  
      return NextResponse.json(author);
    } catch {
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }
  }  

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const { id } = await params;

        const body = await request.json()
        const { name, email, bio, nationality, birthYear } = body   

    if(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return NextResponse.json(
                { error: 'Email invalido'},
                { status: 400}
            )   
        }
    }
    const author = await prisma.author.update({
        where : {id},
        data: {
            name,
            email,
            bio,
            nationality,
            birthYear: birthYear ? parseInt(birthYear) : null,
        },
        include: {
            books: true,
        }
    })
    return NextResponse.json(author, {status: 200})
    } catch (error: any) {
        if (error.code == 'P2O25'){
            return NextResponse.json(
                {error: 'Autor no encontrado'},
                {status: 404}
            )
        }
        if (error.code == 'P2002' ){
            return NextResponse.json(
                {error: 'El email ya esta registrado'},
                {status: 409}
            )
        }

        return NextResponse.json(
            {error: 'Error al actualizar el autor'},
            {status: 500}
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.author.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: "Autor eliminado correctamente" },
            { status: 200 }
        );
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Autor no encontrado' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Error al eliminar el autor' },
            { status: 500 }
        );
    }
}