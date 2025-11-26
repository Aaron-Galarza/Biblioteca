import * as Service from "../services/reports.service.js"

export const LibrosPopulares = async (req, res) => {
    try {
        const libros = await Service.getPopulares()
        res.json(libros)
    } catch (error) {
        res.status(404).json({error: error.message})
    }

}

export const SociosActivos = async (req, res) => {
    try {
        const socios = await Service.getSociosAtivos()
        res.json(socios)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

export const alertasVencidas = async (req, res) => {
    try {
        const vencidos = await Service.getPrestamosVencidos()
        res.json(vencidos)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

