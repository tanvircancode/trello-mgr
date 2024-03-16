const EditNameDescModal = ({ name , setNameForm, button}) => {
    return (
        <div className="card-detail-text w-100">
        <div className="description-form ">
            <textarea
                className="form-control custom-description-form mb-2"
                style={{
                    resize: "none",
                    fontSize: "13px",
                }}
                rows="2"
                // value={name}
                placeholder="Write Something..."
            ></textarea>
            <button
                type="button"
                className="modal-save"
                style={{
                    marginRight: "5px",
                }}
            >
               {button ?? 'Save'}  
            </button>
            <button
                type="button"
                className="modal-cancel"
                onClick={() => setNameForm(false)}
            >
                Cancel
            </button>
        </div></div>
    );
};

export default EditNameDescModal;
