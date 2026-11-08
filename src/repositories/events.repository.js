import { toEventDTO } from '../dto/event.dto.js';

// Repositorio de eventos: abstrae el acceso a datos y entrega DTOs hacia el servicio,
// de modo que ninguna capa superior manipule documentos ni ObjectId de Mongoose.
export default class EventsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async create(eventData) {
    const evento = await this.dao.create(eventData);
    return toEventDTO(evento);
  }

  /**
   * @param {object} filtro criterios ya validados por el servicio
   * @param {{ orden: Record<string, 1|-1>, page: number, limit: number }} paginacion
   * @returns {Promise<{ data: object[], total: number }>}
   */
  async buscar(filtro, { orden, page, limit }) {
    const { docs, total } = await this.dao.buscar(filtro, { orden, skip: (page - 1) * limit, limit });
    return { data: docs.map(toEventDTO), total };
  }

  async getById(id) {
    const evento = await this.dao.getById(id);
    return evento ? toEventDTO(evento) : null;
  }

  async updateById(id, cambios, estadosPermitidos) {
    const evento = await this.dao.updateById(id, cambios, estadosPermitidos);
    return evento ? toEventDTO(evento) : null;
  }
}
