import SearchMember from "./SearchMember";
import { useState, useEffect } from "react";
import "./boardmodal.scss";
import { setMakeBlur } from "../../store";
import { useDispatch, useSelector } from "react-redux";

const AddMemberModal = ({ showAddMemberModal, setShowAddMemberModal }) => {
  const dispatch = useDispatch();
    //new
    const [searchTerm, setSearchTerm] = useState("");
    const [onAddMember, setOnAddMember] = useState(1);

    const [members, setMembers] = useState([]); // Replace with actual member data fetching logic

    useEffect(() => {
        // Simulate member data fetching (replace with actual API call)
        const simulatedMembers = [
            { id: 1, name: "John Doe", email: "john.doe@example.com" },
            { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
            // ... more members
        ];
        setMembers(simulatedMembers);
    }, []);

    const filteredMembers = members.filter(
        (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddMember = (memberId) => {
        onAddMember(memberId); // Pass member ID to parent handler
    };

   
    //new end

    const cancelModal = () => {
      setShowAddMemberModal(false)
      dispatch(setMakeBlur({ makeBlur: false }));
    }
    
    return (
        <div>
            <div
                className={`modal fade ${showAddMemberModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: showAddMemberModal ? "block" : "none",
                    marginTop: "2em",
                }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between member-modal-header">
                            <h1
                                className="modal-title fs-6 text-center"
                                
                            >
                                Share Board
                            </h1>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{ marginLeft: 0, fontSize: "10px" }}
                                onClick={cancelModal}
                            ></button>
                        </div>
                        <SearchMember
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            members={filteredMembers}
                            onAddMember={handleAddMember}
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
