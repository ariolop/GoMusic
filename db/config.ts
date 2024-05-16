import { defineDb, defineTable, column } from 'astro:db';

const Usuario = defineTable({
  columns: {
    idUsuario: column.number({ primaryKey: true }),
    username: column.text(),
    nombre: column.text(),
    apellidos: column.text(),
    email: column.text(),
    contrasena: column.text()
  }
})

const Administrador = defineTable({
  columns: {
    idAdministrador: column.number({ primaryKey: true }),
    idUsuario: column.number({ references: () => Usuario.columns.idUsuario })
  }
})

const Artista = defineTable({
  columns: {
    idArtista: column.number({ primaryKey: true }),
    idUsuario: column.number({ references: () => Usuario.columns.idUsuario })
  }
})

const Normal = defineTable({
  columns: {
    idNormal: column.number({ primaryKey: true }),
    idUsuario: column.number({ references: () => Usuario.columns.idUsuario })
  }
})

const Album = defineTable({
  columns: {
    idAlbum: column.number({ primaryKey: true }),
    nombreAlbum: column.text(),
    idArtista: column.number({ references: () => Artista.columns.idArtista })
  }
})

const Audios = defineTable({
  columns: {
    idAudio: column.number({ primaryKey: true }),
    nombreAudio: column.text(),
    album: column.number({ references: () => Album.columns.idAlbum }),
    genero: column.text(),
    tipo: column.text(),
    rutaImagen: column.text(),
    rutaSonido: column.text(),
    estado: column.text(), //Rechazado, pendiente, aceptado
    subidoEn: column.date(),
    aceptadoEn: column.date({ optional: true }),
    idAdministradorAcepta: column.number({ references: () => Administrador.columns.idAdministrador })
  }
})

// const Album_Cancion = defineTable({
//   columns: {
//     idAlbumAudio: column.number({ primaryKey: true }),
//     idAlbum: column.number({ references: () => Album.columns.idAlbum }),
//     idAudio: column.number({ references: () => Audios.columns.idAudio })
//   }
// })

const Comentarios = defineTable({
  columns: {
    idComentarios: column.number({ primaryKey: true }),
    mensaje: column.text(),
    idUsuario: column.number({ references: () => Normal.columns.idNormal }),
    idAudio: column.number({ references: () => Audios.columns.idAudio })
  }
})

const Usuario_Escucha_Audio = defineTable({
  columns: {
    idEscucha: column.number({ primaryKey: true }),
    idUsuario: column.number({ references: () => Normal.columns.idNormal }),
    idAudio: column.number({ references: () => Audios.columns.idAudio })
  }
})

const Usuario_MeGusta_Audio = defineTable({
  columns: {
    idMegusta: column.number({ primaryKey: true }),
    idUsuario: column.number({ references: () => Normal.columns.idNormal }),
    idAudio: column.number({ references: () => Audios.columns.idAudio })
  }
})

const Playlist = defineTable({
  columns: {
    idPlaylist: column.number({ primaryKey: true }),
    nombre: column.text(),
    visibilidad: column.boolean(),
    usuarioID: column.number({ references: () => Normal.columns.idNormal })
  }
})

const Playlist_Audio = defineTable({
  columns: {
    idPlaylist_Audio: column.number({ primaryKey: true }),
    idPlaylist: column.number({ references: () => Playlist.columns.idPlaylist }),
    idAudio: column.number({ references: () => Audios.columns.idAudio })
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
    Usuario_Escucha_Audio,
    Usuario_MeGusta_Audio,
    Playlist,
    Playlist_Audio
  }
});
