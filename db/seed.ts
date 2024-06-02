import { db, Audios, Administrador, Usuario, Album, Artista } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
		// await db.insert(Usuario).values([
		// {
		//  id: "1",
		//  username: "crilex",
		// 	nombre: "Alejandro",
		// 	apellidos: "Rios Lopez",
		// 	email: "adjlkdhnjlakdhnw@lakndlkas.com",
		// 	contrasena: "123456"
		// 	},
		
		// {
		// 	id: "4",
		// 	username: "giawoodi",
		// 	nombre: "Gia",
		// 	apellidos: "Woods",
		// 	email: "gia_woods@business.com",
		// 	contrasena: "woodMadera,,19"
		// },

		// {
		// 	id: "5",
		// 	username: "cristicc24",
		// 	nombre: "Cristina",
		// 	apellidos: "Cabrera Carrillo",
		// 	email: "criistinacab@gmail.com",
		// 	contrasena: "mividiti--0989"
		// },
		//{
		//	idUsuario: 6,
		//	username: "samariaSS",
		//	nombre: "Samaria",
		//	apellidos: "",
		//	email: "samaria@business.com",
		//	contrasena: "samarita3215.."
		//},

		//{
		//	idUsuario: 7,
		//	username: "sabrinitaCar",
		//	nombre: "Sabrina",
		//	apellidos: "Carpenter",
		//	email: "sabrinacar@business.com",
		//	contrasena: "sabrinacarcar6464.."
		//},
		
	// ])

	// await db.insert(Administrador).values([
	// 	{
	// 		idAdministrador: 1,
	// 		idUsuario: "1"
	// 	},

	// 	{
	// 		idAdministrador: 2,
	// 		idUsuario: "5"
	// 	},
		
	// ])

	// await db.insert(Artista).values([
	// 	{
	// 		idArtista: 1,
	// 		idUsuario: "2"
	// 	},
	// 	{
	// 		idArtista: 2,
	// 		idUsuario: "3"
	// 	},
	// 	{
	// 		idArtista: 3,
	// 		idUsuario: "4"
	// 	},
	// ])

	// await db.insert(Album).values([
	// 	{
	// 		idAlbum: 1,
	// 		nombreAlbum: "Flowing",
	// 		idArtista: 1,
	// 	},
		
	// 	{
	// 		idAlbum: 2,
	// 		nombreAlbum: "11 razones",
	// 		idArtista: 2,
	// 	},

	// 	{
	// 		idAlbum: 3,
	// 		nombreAlbum: "Your_Engine",
	// 		idArtista: 3,
	// 	},
	// ])

	await db.insert(Audios).values([
		{
			idAudio: 1,
			nombreAudio: "Paquito Chocolatero",
			album: 1,
			genero: "asdad",
			tipo: "asdad",
			rutaImagen: "/src/assets/portadas/tvari_tokyo_cafe.jpg",
			rutaSonido: "/src/assets/audios/tvari_tokyo_cafe.mp3",
			estado: "aceptado",
			subidoEn: new Date(Date.parse("2024/04/04")),
			aceptadoEn: new Date(Date.parse("2024/04/04")),
			idAdministradorAcepta: 1
		},
		{
			idAudio: 2,
			nombreAudio: "Happy Day",
			album: 2,
			genero: "asdad",
			tipo: "asdad",
			rutaImagen: "/src/assets/portadas/happy_day.webp",
			rutaSonido: "/src/assets/audios/happy_day.mp3",
			estado: "aceptado",
			subidoEn: new Date(Date.parse("2024/04/06")),
			aceptadoEn: new Date(Date.parse("2024/04/08")),
			idAdministradorAcepta: 1
		},
		{
			idAudio: 3,
			nombreAudio: "Gia Would",
			album: 3,
			genero: "Pop Rock",
			tipo: "asdad",
			rutaImagen: "/src/assets/portadas/Your_engine.jpg",
			rutaSonido: "/src/assets/audios/Gia_would.mp3",
			estado: "aceptado",
			subidoEn: new Date(Date.parse("2024/04/01")),
			aceptadoEn: new Date(Date.parse("2024/04/02")),
			idAdministradorAcepta: 2
		},
	])
}