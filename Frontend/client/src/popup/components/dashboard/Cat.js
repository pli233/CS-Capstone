import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMyCats, deleteCat, getCatById } from '../../actions/cat';
import CatAvatar from './CatAvatar';

import formatDate from '../../utils/formatDate';
import calculateAge from '../../utils/calculateAge';

import { Button, Dropdown } from 'antd';

import './Dashboard.css';

const Cat = ({ deleteCat, getMyCats, cat: { mycats }, getCatById }) => {
  useEffect(() => {
    getMyCats();
  }, [getMyCats]);
  const navigate = useNavigate();
  const handleDeleteCat = async (catId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete the cat?');
      if (confirmDelete) {
        const deleted = await deleteCat(catId);
        if (deleted) {
          getMyCats();
        }
      } else {
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleEditCat = async (catId) => {
    try {
      const isCat = await getCatById(catId);
      if (isCat) {
        navigate('/update-cat');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const cats = mycats.map((cat) => (
    <Fragment key={cat._id}>
      <tr className="computer-layout">
        <td>
          <CatAvatar cat={cat} />
          {/* {cat.avatar ? <img className='round-img-xs' src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + cat.avatar} alt='' />
          : <img className='rround-img-xs' src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + 'public/user/avatar/cat-default-avatar.png'} alt='' />} */}
        </td>
        <td>{cat.name}</td>
        <td className="hide-sm">{cat.sex}</td>
        <td>{formatDate(cat.birthday)}</td>
        <td>{calculateAge(cat.birthday)}</td>
        <td>
          {/* <button
          onClick={() => toggleActions(cat._id)}
          className="btn btn-light"
        >
          <i className="fa-solid fa-list-ul"></i>
        </button> */}
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <div onClick={() => handleEditCat(cat._id)}>
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </div>
                  ),
                  key: '1',
                },
                {
                  label: (
                    <div onClick={() => handleDeleteCat(cat._id)}>
                      <i className="fa-solid fa-trash-can"></i> Delete
                    </div>
                  ),
                  key: '2',
                  danger: true,
                },
              ],
            }}
          >
            <Button>
              <i className="fa-solid fa-list-ul"></i>
            </Button>
          </Dropdown>
        </td>
      </tr>
    </Fragment>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Cats</h2>
      <table className="table computer-layout">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th className="hide-sm">Sex</th>
            <th className="hide-sm">Birthday</th>
            <th className="hide-sm">Age</th>
            <th className="hide-sm">Option</th>
            <th />
          </tr>
        </thead>
        <tbody>{cats}</tbody>
      </table>
      {mycats.map((cat) => (
        <div className="mobile-layout cat-profile  bg-light my-1 p-1" key={cat._id}>
          <div className="cat-profile-grid ">
            <h3 className="text-dark cat-profile-name">{cat.name}</h3>
            <div className="cat-profile-about">
              <p>
                <strong>Age: </strong> {calculateAge(cat.birthday)}
              </p>
              <p>
                <strong>Sex: </strong> {cat.sex}
              </p>
              <p>
                <strong>Current status: </strong> {cat.status}
              </p>
              {cat.bio && (
                <p>
                  <strong>Description: </strong> {cat.bio}
                </p>
              )}
            </div>
            <div className="cat-profile-avatar">
              <CatAvatar cat={cat} />
            </div>
            <div className="cat-profile-option">
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <div onClick={() => handleEditCat(cat._id)}>
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </div>
                      ),
                      key: '1',
                    },
                    {
                      label: (
                        <div onClick={() => handleDeleteCat(cat._id)}>
                          <i className="fa-solid fa-trash-can"></i> Delete
                        </div>
                      ),
                      key: '2',
                      danger: true,
                    },
                  ],
                }}
              >
                <div className="icon-box">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
};

Cat.propTypes = {
  cat: PropTypes.object.isRequired,
  deleteCat: PropTypes.func.isRequired,
  getMyCats: PropTypes.func.isRequired,
  getCatById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cat: state.cat,
});

export default connect(mapStateToProps, { getMyCats, deleteCat, getCatById })(Cat);
