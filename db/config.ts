import { defineDb, defineTable, column } from 'astro:db';

const Usuario = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, unique: true }),
    username: column.text({ unique: true }),
    nombre: column.text(),
    apellidos: column.text(),
    email: column.text({ optional: false, unique: true }),
    contrasena: column.text(),
    imagenPerfil: column.text({ default: "" })
  }
})

const Administrador = defineTable({
  columns: {
    idAdministrador: column.text({ primaryKey: true }),
    idUsuario: column.text({ unique: true, references: () => Usuario.columns.id })
  }
})

const Artista = defineTable({
  columns: {
    idArtista: column.text({ primaryKey: true }),
    idUsuario: column.text({ unique: true, references: () => Usuario.columns.id })
  }
})

const Normal = defineTable({
  columns: {
    idNormal: column.text({ primaryKey: true }),
    idUsuario: column.text({ unique: true, references: () => Usuario.columns.id })
  }
})

const Audios = defineTable({
  columns: {
    idAudio: column.text({ primaryKey: true }),
    nombreAudio: column.text(),
    descripcion: column.text({ optional: true }),
    genero: column.text(),
    tipo: column.text(),
    rutaImagen: column.text(),
    rutaSonido: column.text(),
    subidoEn: column.date(),
    autores_secundarios: column.text({ optional: true }),
    archivoSonidoOriginal: column.text({ default: "" })
  }
})

const Album = defineTable({
  columns: {
    idAlbum: column.text({ primaryKey: true }),
    nombreAlbum: column.text(),
    idArtista: column.text({ references: () => Artista.columns.idArtista }),
    esSencillo: column.text({ })
  }
})

const Album_Audio = defineTable({
  columns: {
    idAlbumAudio: column.text({ primaryKey: true }),
    idAlbum: column.text({ references: () => Album.columns.idAlbum }),
    idAudio: column.text({ references: () => Audios.columns.idAudio })
  }
})

const Comentarios = defineTable({
  columns: {
    idComentarios: column.text({ primaryKey: true }),
    mensaje: column.text(),
    idUsuario: column.text({ references: () => Normal.columns.idNormal }),
    idAudio: column.text({ references: () => Audios.columns.idAudio })
  }
})

const Escuchas = defineTable({
  columns: {
    idEscucha: column.text({ primaryKey: true }),
    idNormal: column.text({ references: () => Normal.columns.idNormal }),
    idAudio: column.text({ references: () => Audios.columns.idAudio }),
    fechaHora: column.date()
  }
})

const Usuario_MeGusta_Audio = defineTable({
  columns: {
    idMegusta: column.text({ primaryKey: true }),
    idUsuario: column.text({ references: () => Normal.columns.idNormal }),
    idAudio: column.text({ references: () => Audios.columns.idAudio })
  }
})

const Playlist = defineTable({
  columns: {
    idPlaylist: column.text({ primaryKey: true }),
    nombre: column.text(),
    visibilidad: column.boolean(),
    usuarioID: column.text({ references: () => Normal.columns.idNormal})
  }
})

const Playlist_Audio = defineTable({
  columns: {
    idPlaylist_Audio: column.text({ primaryKey: true }),
    idPlaylist: column.text({ references: () => Playlist.columns.idPlaylist }),
    idAudio: column.text({ references: () => Audios.columns.idAudio })
  }
})

const Session = defineTable({
  columns: {
    id: column.text({ optional: false , unique: true}),
    userId: column.text({ optional: false, references: () => Usuario.columns.id }),
    expiresAt: column.number()
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: { 
    Usuario,
    Administrador,
    Artista,
    Normal,
    Audios,
    Album,
    Comentarios,
    Usuario_MeGusta_Audio,
    Playlist,
    Playlist_Audio,
    Session,
    Album_Audio,
    Escuchas
  }
});
