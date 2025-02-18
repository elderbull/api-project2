import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';

import './DeleteSpotModal.css';



const DeleteSpotModal = ({spotId}) => {

    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const handleDel = async () => {
        await dispatch(deleteSpot(spotId));
        closeModal();

    }


    return (
       <div className='dm-box'>
            <div className='dm-header'>
                <h1>Confirm Delete</h1>
            </div>
            <div className='md-content'>
                <h2>Are you sure you want to remove this spot from the listings?</h2>
            </div>
            <div className='md-bttn-box'>
                <div className='md-yes-bttn'>
                    <button className='md-yes-bttn-confirm' type='button' onClick={handleDel}>
                        Yes (Delete Spot)
                    </button>
                </div>
                <div className='md-no-bttn'>
                    <button className='md-no-bttn-confirm' type='button' onClick={closeModal}>
                        No (Keep Spot)
                    </button>
                </div>
            </div>
       </div>
    )
}

export default DeleteSpotModal;
