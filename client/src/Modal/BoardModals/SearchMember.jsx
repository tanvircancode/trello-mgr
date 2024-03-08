
import "./boardmodal.scss";


const SearchMember = ({ searchTerm, onSearchChange, members, onAddMember }) => {
  return (
    <div className="search-member d-flex flex-column align-items-flex-start mb-3">
    
      <input
        type="text"
        placeholder="Search Members"
        value={searchTerm}
        onChange={onSearchChange}
        
      />
  {/* member 1 */}

      <div className="d-flex align-items-center member-details-row mb-3">
        <div className="d-flex flex-column flex-grow-1">
              <span className="member-name">Tanvir Ahmed Chowdhury</span>
              <span className="member-email">tanvir@gmail.com</span>
        </div>
        <button type="button" className=" btn btn-primary add-member-button">
            Add Member
        </button>
      </div>


      {/* member 2 */}

      <div className="d-flex align-items-center member-details-row">
        <div className="d-flex flex-column flex-grow-1">
              <span className="member-name">Towhid Ahmed</span>
              <span className="member-email">towhid2002@gmail.com</span>
        </div>
        <button type="button" className=" btn btn-primary add-member-button" disabled={true}>
            Already a member
        </button>
      </div>

     
    </div>
  )
}

export default SearchMember