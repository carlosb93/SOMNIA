/*
* Activa todas las tablas del WebAPP can el lenguaje en español mediante,
* el uso de jQuery  
*/
$(function () {
    $('table[data-atribute="table"]').DataTable({
        language: {
            'decimal': '.',
            'emptyTable': 'Ningún registro disponible en esta tabla',
            'info': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            'infoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
            'infoFiltered': '(filtered from _MAX_ total entries)',
            'infoPostFix': '',
            'thousands': '.',
            'lengthMenu': 'Mostrar _MENU_ registros',
            'loadingRecords': 'Cargando...',
            'processing': 'Procesando...',
            'search': 'Buscar:',
            'zeroRecords': 'No se encontraron resultados',
            'paginate': {
                'first': 'Primero',
                'last': 'Último',
                'next': 'Siguiente',
                'previous': 'Anterior',
            },
            'aria': {
                'sortAscending': 'Activar para ordenar la columna de manera ascendente',
                'sortDescendin': 'Activar para ordenar la columna de manera descendente'
            }
        }
    });
});
