import './styles.scss'

function ProductFinder({ handleSearch, setSearchText, searchText, loading, error }) {
    return (
        <div className="generalContainerFilter">
            <div>
                <form onSubmit={handleSearch}>
                    <input 
                        type='text' 
                        placeholder='Filtrar productos' 
                        value={searchText} 
                        onChange={(e) => setSearchText(e.target.value)} 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Consultando productos...' : 'Filtrar'}
                    </button>
                </form>

                {error && <div className='error'>Ocurrió un error: {error.message}</div>}
            </div>
        </div>
    )
}

export default ProductFinder;